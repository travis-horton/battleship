export function errorsInConfigInput(config) {
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
    } else if (config[entry].length > 20) {
      errorMsg += `Your ${computerToHuman[entry]} is greater than 20 characters.\n`;
    }

    if (regx.test(config[entry])) {
      errorMsg += `You can only use letters or numbers in ${computerToHuman[entry]}.\n`;
    }
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

export function choosePlayerName(extraPrompt) {
  extraPrompt = extraPrompt ? (extraPrompt + "\n") : "";
  let playerName = prompt(extraPrompt + "Choose a player name (or enter your player name to log back in): ");
  let regx = /[^a-zA-Z0-9]/;
  while (regx.test(playerName)) {
    playerName = choosePlayerName("Name must contain only numbers and/or letters. ");
  }

  while (playerName.length > 20 || playerName.length === 0) {
    playerName = choosePlayerName("Name must be between 1 & 20 characters long. ");
  }

  return playerName;
}
