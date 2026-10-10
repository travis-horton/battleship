// Tests for the parts of the game that can run without Firebase: setup checks,
// ship bookkeeping, drawing boards, joining a game (against a tiny in-memory
// stand-in for the database), hits and sinking, and the end of the game.
// Run with `npm test`.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import ReactDOMServer from 'react-dom/server.js';

import submitConfig from '../src/modules/config.js';
import joinGame from '../src/modules/connect.js';
import { getHits } from '../src/modules/shooting.js';
import {
  allShipsArePlaced, allThisPlayersShipsArePlaced, allPlayersShipsPlaced,
} from '../src/modules/ships.js';
import Board from '../src/components/board.jsx';
import Instructions from '../src/components/instructions.jsx';

const { renderToStaticMarkup } = ReactDOMServer;

const maxShips = {
  a: 5, b: 4, c: 3, s: 3, d: 2,
};
const fleet = { // one full fleet, the same layout for every player
  a: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
  b: [[4, 0], [4, 1], [4, 2], [4, 3]],
  c: [[6, 0], [6, 1], [6, 2]],
  s: [[8, 0], [8, 1], [8, 2]],
  d: [[0, 0], [0, 1]],
};
const noHits = () => ({
  a: [false], b: [false], c: [false], s: [false], d: [false],
});
const allSunk = (shooter) => Object.fromEntries(Object.entries(maxShips)
  .map(([ship, n]) => [ship, Array.from({ length: n }, () => ({ turn: 0, shooter }))]));
const emptyGrid = (size) => Array.from({ length: size }, () => Array.from(
  { length: size }, () => ({ ship: '', shot: false, color: '' }),
));

let alerts;
let prompts;
beforeEach(() => {
  alerts = [];
  prompts = [];
  globalThis.alert = (msg) => alerts.push(String(msg));
  globalThis.prompt = () => prompts.shift();
});

// A synchronous, in-memory stand-in for the slice of the Firebase API the game uses.
const fakeDb = (data) => {
  const store = { root: structuredClone(data) };
  const keys = (path) => String(path).split('/').filter(Boolean);
  const get = (path) => keys(path).reduce((o, k) => (o == null ? undefined : o[k]), store.root);
  const snapshot = (path) => {
    const value = get(path);
    return {
      val: () => (value === undefined ? null : structuredClone(value)),
      exists: () => value !== undefined && value !== null,
      hasChild: (k) => value != null && k in value,
    };
  };
  return {
    store,
    ref: (path) => ({
      once: (event, cb) => { if (cb) cb(snapshot(path)); return Promise.resolve(snapshot(path)); },
      on: (event, cb) => cb(snapshot(path)),
      set: (value) => {
        const ks = keys(path);
        const parent = ks.slice(0, -1).reduce((o, k) => {
          if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; // eslint-disable-line no-param-reassign
          return o[k];
        }, store.root);
        parent[ks[ks.length - 1]] = structuredClone(value);
        return Promise.resolve();
      },
      onDisconnect: () => ({ set: () => {} }),
    }),
  };
};

const player = (overrides) => ({
  connected: false,
  thisPlayerTurn: false,
  shipsAreCommitted: false,
  lost: false,
  playerColor: 'green',
  hitsOnThisPlayer: noHits(),
  ...overrides,
});

const fakeApp = () => ({
  updates: [],
  state: {
    config: { maxShips },
    localInfo: {
      ships: {
        a: [], b: [], c: [], s: [], d: [],
      },
      potentialShots: [],
      boardInfo: [],
    },
  },
  setState(update) { this.updates.push(update); },
});

// ---------- setup form ----------

test('submitting a valid setup form goes on to create the game', () => {
  const asked = [];
  const db = { ref: (path) => { asked.push(path); return { once: () => new Promise(() => {}) }; } };
  submitConfig({
    playerName: 'alpha', playerColor: 'green', gameId: 'g1', boardSize: 10, maxPlayers: 2,
  }, db, {});
  assert.deepEqual(alerts, []);
  assert.deepEqual(asked, ['/']);
});

test('submitting a bad setup form explains every problem and stops', () => {
  const db = { ref: () => assert.fail('should not touch the database') };
  submitConfig({
    playerName: 'al!', playerColor: '', gameId: 'g1', boardSize: 30, maxPlayers: 2,
  }, db, {});
  assert.equal(alerts.length, 1);
  assert.match(alerts[0], /didn't choose a player color/);
  assert.match(alerts[0], /only use letters or numbers in player name/);
  assert.match(alerts[0], /between 10 and 20 for board size/);
});

// ---------- ship bookkeeping ----------

test('ship checks count a full fleet as placed and a short one as not', () => {
  const short = { ...fleet, d: [[0, 0]] };
  assert.equal(allShipsArePlaced(fleet, maxShips), true);
  assert.equal(allShipsArePlaced(short, maxShips), false);
  assert.equal(allThisPlayersShipsArePlaced(fleet, maxShips), true);
  assert.equal(allThisPlayersShipsArePlaced(short, maxShips), false);
});

test('the game waits until every player has joined and committed ships', () => {
  const ready = player({ shipsAreCommitted: true });
  assert.equal(allPlayersShipsPlaced({ alpha: ready, bravo: ready }, 2), true);
  assert.equal(allPlayersShipsPlaced({ alpha: ready, bravo: player() }, 2), false);
  assert.equal(allPlayersShipsPlaced({ alpha: ready }, 2), false);
});

// ---------- drawing boards ----------

test('a shooting board draws, marking only the squares picked this turn', () => {
  const html = renderToStaticMarkup(createElement(Board, {
    config: { size: 10, style: 'destination', owner: 'bravo' },
    data: emptyGrid(10),
    turn: 1,
    potentialShots: [[0, 1]],
    playerColors: {},
    classNames: '',
  }));
  assert.equal(html.match(/potentialShot/g).length, 1);
});

test('the in-game panel lists connected players by name', () => {
  const players = {
    alpha: player({ connected: true, shipsAreCommitted: true, thisPlayerTurn: true }),
    bravo: player({ connected: true, shipsAreCommitted: true, playerColor: 'purple' }),
  };
  const html = renderToStaticMarkup(createElement(Instructions, {
    allShipsArePlaced: true,
    shipsAreCommitted: true,
    name: 'alpha',
    players,
    maxPlayers: 2,
    turnNumber: 0,
    whosTurn: 'alpha',
    allShots: [{ alpha: [0], bravo: [0] }],
    potentialShots: [],
    shipMaxes: maxShips,
    hitsOnThisPlayer: noHits(),
    turnOrder: ['alpha', 'bravo'],
    playerColors: { alpha: 'green', bravo: 'purple' },
    commitShips: () => {},
    commitShots: () => {},
  }));
  assert.match(html, /<p class="green">alpha<\/p>/);
  assert.match(html, /<p class="purple">bravo<\/p>/);
  assert.doesNotMatch(html, /object Object/);
});

test('the waiting panel names the players who are connected', () => {
  const html = renderToStaticMarkup(createElement(Instructions, {
    shipsAreCommitted: true,
    name: 'alpha',
    players: { alpha: player({ connected: true, shipsAreCommitted: true }), bravo: player({ connected: true }) },
    maxPlayers: 2,
  }));
  assert.match(html, /alpha, bravo/);
});

// ---------- joining a game ----------

const newGame = () => ({
  g1: {
    config: {
      boardSize: 10, gameId: 'g1', maxPlayers: 2, maxShips,
    },
    gameState: {
      turnNumber: 0,
      turnOrder: ['alpha'],
      shots: [{ alpha: false }],
      players: { alpha: player() },
    },
    ships: { alpha: false },
  },
});

test('the game creator connects and gets a board to place ships on', () => {
  const db = fakeDb(newGame());
  const app = fakeApp();
  joinGame(db, app, 'g1', 'alpha');
  const last = app.updates.at(-1);
  assert.equal(last.localInfo.status, 'gameOn');
  assert.deepEqual(last.localInfo.boardInfo.map((b) => b.config.style), ['input']);
});

test('a second player can join and is offered the colours still free', () => {
  const db = fakeDb(newGame());
  prompts.push('purple');
  joinGame(db, fakeApp(), 'g1', 'bravo');
  assert.equal(db.store.root.g1.gameState.players.bravo.playerColor, 'purple');
});

const gameInPlay = (hits = {}) => {
  const data = newGame();
  data.g1.gameState.turnOrder = ['alpha', 'bravo'];
  data.g1.gameState.shots = [{ alpha: [0], bravo: [0] }];
  data.g1.gameState.players = {
    alpha: player({ shipsAreCommitted: true, hitsOnThisPlayer: hits.alpha || noHits() }),
    bravo: player({ shipsAreCommitted: true, playerColor: 'purple', hitsOnThisPlayer: hits.bravo || noHits() }),
  };
  data.g1.ships = { alpha: fleet, bravo: fleet };
  return data;
};

test('once ships are committed, your own board is drawn with your fleet on it', () => {
  const app = fakeApp();
  joinGame(fakeDb(gameInPlay()), app, 'g1', 'alpha');
  const boards = app.updates.at(-1).localInfo.boardInfo;
  assert.deepEqual(boards.map((b) => [b.config.style, b.config.owner]), [['destination', 'bravo'], ['ships', 'alpha']]);
  assert.equal(boards[1].data[0][0].ship, 'd');
  assert.equal(boards[1].data[2][4].ship, 'a');
});

test('the player whose ships are all sunk is told they lost', () => {
  const app = fakeApp();
  joinGame(fakeDb(gameInPlay({ alpha: allSunk('bravo') })), app, 'g1', 'alpha');
  assert.deepEqual(alerts, ['You lost!']);
  assert.equal(app.updates.at(-1).localInfo.status, 'gameEnd');
});

test('the last player afloat is told they won', () => {
  joinGame(fakeDb(gameInPlay({ alpha: allSunk('bravo') })), fakeApp(), 'g1', 'bravo');
  assert.deepEqual(alerts, ['You won!!']);
});

// ---------- hits and sinking ----------

const quietly = (fn) => {
  const { log } = console;
  console.log = () => {};
  try { return fn(); } finally { console.log = log; }
};

test('a ship sinks even if its owner once fired at the same squares', () => {
  // Turn 0: alpha fired at (0,0) and (0,1) on bravo's board. Those shots never
  // touched alpha's own board, so bravo's hits there must count.
  const prevShots = [{ alpha: [[0, 0], [0, 1], [9, 9]], bravo: [0] }];
  const hits = quietly(() => getHits(
    [[0, 0], [0, 1]], prevShots, { alpha: fleet, bravo: fleet },
    { alpha: noHits(), bravo: noHits() }, 'bravo', 0, maxShips,
  ));
  assert.equal(hits.alpha.d.filter((hit) => !hit.duplicateHit).length, 2);
  assert.deepEqual(alerts, ["You sunk alpha's destroyer!!"]);
});

test('a square another player already hit does not count twice', () => {
  const prevShots = [{ alpha: [0], bravo: [0], charlie: [[0, 0]] }];
  const before = noHits();
  before.d = [{ turn: 0, shooter: 'charlie' }];
  const hits = quietly(() => getHits(
    [[0, 0]], prevShots, { alpha: fleet, bravo: fleet, charlie: fleet },
    { alpha: before, bravo: noHits(), charlie: noHits() }, 'bravo', 1, maxShips,
  ));
  assert.equal(hits.alpha.d.length, 2);
  assert.equal(hits.alpha.d[1].duplicateHit, true);
  assert.deepEqual(alerts, []);
});
