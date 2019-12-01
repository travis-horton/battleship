import { getLocalData } from "./connect.js";

// Checks config for errors: Only alphanumeric values, less the 20 characters, and numbers 
// fit the board size and number of player restrictions.
// RETURNS: TRUE if there are errors, FALSE if no errors.
const errorsInConfigInput = (config) => {
  config.playerName = config.playerName.trim();
  config.gameId = config.gameId.trim();
  let errorMsg = "";
  let computerToHuman = {
    playerName: "player name",
    gameId: "game id",
    boardSize: "board size",
    numPlayers: "number of players"
  }
  let regx = /[^a-zA-Z0-9]/;

  for (let entry in config) {
    if (config[entry].length === 0) {
      errorMsg += `You didn't choose a ${computerToHuman[entry]}.\n`;
    }

    if (config[entry].length > 20) {
      errorMsg += `Your ${computerToHuman[entry]} is greater than 20 characters.\n`;
    }
  }

  if (regx.test(config.playerName)) {
    errorMsg += `You can only use letters or numbers in player name.\n`;
  }

  if (regx.test(config.gameId)) {
    errorMsg += `You can only use letters or numbers in game id.\n`;
  }

  if (config.boardSize.toString().indexOf(".") > -1 || config.boardSize < 10 || config.boardSize > 20) {
    errorMsg += `You must enter a whole number between 10 and 20 for board size.\n`;
  }

  if (config.numPlayers.toString().indexOf(".") > -1 || config.numPlayers < 2 || config.numPlayers > 4) {
    errorMsg += `You must enter a whole number between 2 and 4 for number of players.\n`;
  }

  if (errorMsg.length > 0) {
    errorMsg += "Try again.";
    alert(errorMsg);
    return true;
  } else {
    return false;
  };
}

export const submitConfig = (config, db, self) => {
  if (errorsInConfigInput(config)) return;

  db.ref("/").once("value").then((snapshot) => {
    if (snapshot.hasChild(config.gameId)) {
      alert("Game ID already taken, choose a new game ID.");
      return;
    }

    // Initialize configurations for db.
    let fBState = {
      boardSize: config.boardSize,
      gameId: config.gameId,
      numPlayers: config.numPlayers,
      // Initialize this player in players.
      players: {
        [config.playerName]: {
          connected: true,
          thisPlayerTurn: false,
          shipsCommitted: false
        }
      }
    }

    // Set db state.
    db.ref(config.gameId).set(fBState);

    // On change to db state, update client state.
    db.ref(config.gameId).on('value', (snapshot) => {
      self.setState(getLocalData(snapshot.val(), config.playerName));
    });
    db.ref(`${config.gameId}/players/${config.playerName}/connected`).onDisconnect().set(false);
  });
}
