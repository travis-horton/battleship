import { allPlayersShipsPlaced, whatShipIsHere } from './ships.js';

export const shotsThisPlayerGets = (hitsOnThisPlayer, maxShips) => {
  let shots = 6;
  for (const ship in hitsOnThisPlayer) {
    const uniqueHitsOnThisShip = hitsOnThisPlayer[ship].filter((hit) => !hit.duplicateHit);
    if (uniqueHitsOnThisShip.length === maxShips[ship]) shots = ship === 'b' ? shots - 2 : shots - 1;
  }
  return shots;
};

const isSameShot = (coord, prevShot) => {
  if (coord[0] === prevShot[0] && coord[1] === prevShot[1]) return true;
  return false;
};

const newStateWithShot = (oldState, turn, name, newShotsThisTurn, shotCoord, addOrRemove = 'remove') => {
  oldState.localInfo.potentialShots = newShotsThisTurn;
  let turnToAdd = turn;
  if (oldState.gameState.shots[turn] && oldState.gameState.shots[turn][name][0]) turnToAdd++;
  for (const board in oldState.localInfo.boardInfo) {
    const thisBoard = oldState.localInfo.boardInfo[board];
    if (thisBoard.config.style !== 'ships') {
      thisBoard.data[shotCoord[0]][shotCoord[1]].potentialShot = addOrRemove === 'add' ? turnToAdd : false;
    }
  }
  return oldState;
};

export const generateNewStateWithShot = (coord, state, self) => {
  const { localInfo, config, gameState } = state;
  const {
    name, status, boardInfo, ships,
  } = localInfo;
  const { shots } = gameState;
  const thisTurnNumber = gameState.turnNumber;
  const hits = gameState.players[name].hitsOnThisPlayer;
  const newShotsThisTurn = localInfo.potentialShots;

  for (const turnNumber in shots) {
    for (const shot in shots[turnNumber][name]) {
      const thisShot = shots[turnNumber][name][shot];
      if (isSameShot(coord, thisShot)) {
        alert("You've already shot there!");
        return;
      }
    }
  }

  for (const shot in newShotsThisTurn) {
    if (isSameShot(coord, newShotsThisTurn[shot])) {
      newShotsThisTurn.splice(shot, 1);
      return newStateWithShot(state, thisTurnNumber, name, newShotsThisTurn, coord);
    }
  }

  if (newShotsThisTurn.length >= shotsThisPlayerGets(hits, config.maxShips)) {
    alert("You don't get any more shots!");
    return;
  }

  if (newShotsThisTurn[0] === 0) {
    newShotsThisTurn[0] = coord;
  } else {
    newShotsThisTurn.push(coord);
  }

  return newStateWithShot(state, thisTurnNumber, name, newShotsThisTurn, coord, 'add');
};

export const getNewGameStateAfterShooting = (gameState, shotsToAdd, name, hits) => {
  const newGameState = { ...gameState };

  newGameState.shots[gameState.turnNumber][name] = shotsToAdd;

  const { turnOrder, turnNumber } = newGameState;
  const curPlayerIndex = turnOrder.indexOf(name);
  let nextPlayer;

  if (curPlayerIndex + 1 === turnOrder.length) {
    nextPlayer = turnOrder[0];
    newGameState.turnNumber++;
  } else {
    nextPlayer = turnOrder[curPlayerIndex + 1];
  }

  if (!newGameState.shots[turnNumber + 1]) {
    newGameState.shots[turnNumber + 1] = {};
  }
  for (const player in newGameState.players) {
    newGameState.players[player].hitsOnThisPlayer = hits[player];
    if (!newGameState.shots[turnNumber + 1][player]) {
      newGameState.shots[turnNumber + 1][player] = [0];
    }
  }

  newGameState.players[name].thisPlayerTurn = false;
  newGameState.players[nextPlayer].thisPlayerTurn = true;

  return newGameState;
};

const didHitThisShip = (shot, ship) => {
  if (shot[0] === ship[0] && shot[1] === ship[1]) return true;
  return false;
};

const alreadyHitThisShip = (shipLoc, prevShots, thisPlayer, thisShooter) => {
  for (const turn in prevShots) {
    for (const player in prevShots[turn]) {
      if (player === thisShooter) continue;
      for (const shot in prevShots[turn][player]) {
        if (didHitThisShip(prevShots[turn][player][shot], shipLoc)) {
          return true;
        }
      }
    }
  }

  return false;
};

const noHitsOnThisShip = (hitsOnThisShip) => {
  if (hitsOnThisShip[0] === false) return true;
  return false;
};

const addHit = (hitsOnThisShip, hitInfo) => {
  if (noHitsOnThisShip(hitsOnThisShip)) {
    hitsOnThisShip[0] = hitInfo;
  } else {
    hitsOnThisShip.push(hitInfo);
  }
};

const addNewShotsThatHitThisShipLocToHits = (
  thisTurnShots,
  allPrevShots,
  shipLoc,
  hits,
  newHitInfo,
  maxOfThisShip,
  shooter,
  player,
  ship,
) => {
  for (const shot in thisTurnShots) {
    const thisShot = thisTurnShots[shot];
    if (didHitThisShip(thisShot, shipLoc)) {
      if (alreadyHitThisShip(shipLoc, allPrevShots, player, shooter)) {
        newHitInfo.duplicateHit = true;
      }
      addHit(hits, newHitInfo);
      if (hits.filter((hit) => !hit.duplicateHit).length === maxOfThisShip) {
        const humanShipNames = {
          a: 'aircraft carrier',
          b: 'battleship',
          c: 'cruiser',
          d: 'destroyer',
          s: 'submarine',
        };

        alert(`You sunk ${player}'s ${humanShipNames[ship]}!!`);
      }
    }
  }
};

export const getHits = (shots, prevShots, ships, hits, shooter, turn, maxShips) => {
  for (const player in ships) {
    if (player === shooter) continue;
    for (const ship in ships[player]) {
      for (const shipLoc in ships[player][ship]) {
        addNewShotsThatHitThisShipLocToHits(
          shots,
          prevShots,
          ships[player][ship][shipLoc],
          hits[player][ship],
          { turn, shooter },
          maxShips[ship],
          shooter,
          player,
          ship,
        );
      }
    }
  }

  console.log(hits);
  return hits;
};
