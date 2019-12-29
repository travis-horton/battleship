import { randomizeTurnOrder } from "./ships.js";
import { allPlayersShipsPlaced } from "./ships.js";
import { getHits } from "./shooting.js";
import { Board } from "../components/board.js";

// returns a user-chosen name that is under 20 alphanumeric characters
const choosePlayerName = (extraPrompt = "") => {
  let name = prompt(extraPrompt + "Choose a player name (or enter your player name to log back in): ");
  let regx = /[^a-zA-Z0-9 ]/;

  while (regx.test(name)) {
    name = choosePlayerName("Name must contain only numbers and/or letters. \n");
    while (name.length > 20 || name.length === 0) {
      name = choosePlayerName("Name must be between 1 & 20 characters long. \n");
    }
  }

  return name;
};

const getLocalInfo = (ships, shots, name) => {
  return {
    name: name,
    ships: ships,
    status: "gameOn",
  };
};

const getLocalState = (dbData, name) => {
  const boardSize = dbData.config.boardSize;
  return {
    config: dbData.config,
    gameState: dbData.gameState,
    localInfo: {
      ...getLocalInfo(dbData.ships[name], dbData.shots[name], name),
      boards: [
        new Board({
          config: {
            size: boardSize,
            style: "input",
            owner: name,
          },
          data: new Array(boardSize).fill(new Array(boardSize).fill({ shot: false, ship: "", color: "white" }))
        }),
      ]
    },
  };
};

// connects player to gameId in db
// tells db to update client on changes to db
const connect = (db, gameId, name, info, self) => {
  info.connected = true;
  db.ref(`${gameId}/gameState/players/${name}`).set(info);
  db.ref(`${gameId}/gameState/players/${name}/connected`).onDisconnect().set(false);

  // Tells db to update client on changes to db
  db.ref(gameId).on('value', (snapshot) => {
    self.setState(getLocalState(snapshot.val(), name));
  });
};

export default function joinGame(
  db,
  self,
  gameId = prompt("Enter game id: "),
  name = choosePlayerName(),
) {
  if (gameId === null || gameId.length === 0) return;

  db.ref(gameId).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      alert("No such game in database.");
      return;
    }

    const { config, gameState } = snapshot.val();
    const numPlayers = Object.keys(gameState.players).length
    let playerInfo;
    
    // determines playerInfo based on if player is reconnecting or connecting for the first time
    // while also rejecting if player is already connected or if there's no room for a new player
    if (name in gameState.players) {
      if (gameState.players[name].connected) {
        alert("That player is already connected.");
        return;
      }

      playerInfo = gameState.players[name];

    } else if (numPlayers >= config.maxPlayers) {
      alert("Game is full.");
      return;
    } else {
      playerInfo = {
        connected: true,
        thisPlayerTurn: false,
        shipsCommitted: false,
        lost: false,
      };
    };

    connect(db, gameId, name, playerInfo, self);

    if (allPlayersShipsPlaced(gameState.players, numPlayers) && gameState.turnOrder === 0) {
      const turnOrder = randomizeTurnOrder(players);
      db.ref(`${gameId}/gameState/turnOrder`).set(turnOrder);
      db.ref(`${gameId}/gameState/players/${turnOrder[0]}/thisPlayerTurn`).set(true);
    }
  });
};
