import { randomizeTurnOrder } from "./ships.js";
import { allPlayersShipsPlaced } from "./ships.js";

const choosePlayerName = (extraPrompt) => {
  extraPrompt = extraPrompt ? (extraPrompt + "\n") : "";
  let playerName = prompt(extraPrompt + "Choose a player name (or enter your player name to log back in): ");
  let regx = /[^a-zA-Z0-9 ]/;
  while (regx.test(playerName)) {
    playerName = choosePlayerName("Name must contain only numbers and/or letters. ");
  }

  while (playerName.length > 20 || playerName.length === 0) {
    playerName = choosePlayerName("Name must be between 1 & 20 characters long. ");
  }

  return playerName;
}

export const getLocalData = (dbData, thisPlayerName) => {
  // Gets config data.
  let newState = {
    boardSize: dbData.boardSize,
    gameId: dbData.gameId,
    numPlayers: dbData.numPlayers,
    playerName: thisPlayerName,
    players: dbData.players,
    turn: dbData.turn,
    turnOrder: dbData.playerTurnOrder ? dbData.playerTurnOrder : null
  };

  // Gets this player's ship data.
  if (dbData[(thisPlayerName + "Ships")] !== undefined) {
    newState.ships = dbData[(thisPlayerName + "Ships")];
  }

  // Gets shots data.
  if (dbData.shots !== undefined) {
    newState.shots = dbData.shots;
  }

  return newState;
}

export const joinGame = (gameId, db, self, playerName = choosePlayerName()) => {
  db.ref(gameId).once('value', (snapshot) => {
    if (!snapshot.exists()) {
      alert("No such game in database.");
      return;
    }

    let maxNumPlayers = snapshot.val().numPlayers;
    let curNumPlayers = Object.keys(snapshot.val().players).length;

    // Gets database data about players.
    db.ref(`${gameId}/players`).once("value").then((players) => {
      let areShipsCommitted = false;
      let isThisPlayerTurn = false;

      if (players.hasChild(playerName)) {
        // If playername is connected, refuses additional connection.
        if (players.val()[playerName].connected) {
          alert("That player is already connected.");
          return;
        }

        // TODO: Get a password from player to allow reconnection?

        // Sets player's ship's committed status to db state.
        areShipsCommitted = players.val()[playerName].shipsCommitted;
        isThisPlayerTurn = players.val()[playerName].thisPlayerTurn;

      } else if (curNumPlayers >= maxNumPlayers) {
        alert("Game is full.");
        return;
      }

      let thisPlayerInfo = {
        connected: true,
        thisPlayerTurn: isThisPlayerTurn,
        shipsCommitted: areShipsCommitted
      };

      // Sets db state and tells db on disconnect to set connected to false. This should be its own function.
      db.ref(`${gameId}/players/${playerName}`).set(thisPlayerInfo);
      db.ref(`${gameId}/players/${playerName}/connected`).onDisconnect().set(false);

      // Tells db to alert client on changes to db and subsequently updates client state.
      db.ref(gameId).on('value', (snapshot) => {
        let fBState = snapshot.val();
        self.setState(getLocalData(fBState, playerName));
        
        const { players, numPlayers } = fBState;
        const turnOrder = randomizeTurnOrder(players);
        if (allPlayersShipsPlaced(players, numPlayers) && !("playerTurnOrder" in fBState)) {
          db.ref(`${gameId}/playerTurnOrder`).set(turnOrder);
          db.ref(`${gameId}/players/${turnOrder[0]}/thisPlayerTurn`).set(true);
        }
      });
    });
  });
}
