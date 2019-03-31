export {
  errorsInConfigInput,
  whatShipIsHere,
  isShip,
  thisShipCanGoHere,
  howManyShipsOfThisType,
  isAdjacent,
  isInLine,
  isAdjacentColumn,
  isAdjacentRow,
  getOrientation,
  newShipsWithoutThisLoc,
  allShipsArePlaced,
  choosePlayerName,
  isShotAt,
  numberOfShotsYouGet,
  indexOf
};

function errorsInConfigInput(config) {
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

function whatShipIsHere(c, r, ships) {
  for (let ship in ships) {
    if (ships[ship].locs[0] === null) continue;
    for (let loc in ships[ship].locs) {
      if (ships[ship].locs[loc][0] === c && ships[ship].locs[loc][1] === r) {
        return (ship);
      }
    }
  }
  return "";
}

function isShip(value) {
  let regex = /^[ABCDSabcds]$/
  if (regex.test(value)) return true;
  return false;
}

function thisShipCanGoHere(thisShip, c, r, allShipsOfType) {
  let thisShipLoc = [c, r]
  let countOfThisShip = howManyShipsOfThisType(thisShip, allShipsOfType.locs);
  if (countOfThisShip >= allShipsOfType.max) {
    alert(
      `You can only place ${allShipsOfType.max} "${thisShip}"s and you've already placed ${allShipsOfType.max}.`
    )
    return false;
  }
  if (countOfThisShip === 0) return true;
  if (countOfThisShip === 1) return isAdjacent(thisShipLoc, allShipsOfType.locs)
  return (isAdjacent(thisShipLoc, allShipsOfType.locs) && isInLine(thisShipLoc, allShipsOfType.locs))
}

function howManyShipsOfThisType(type, allShips) {
  if (allShips[0] === 0) return 0;
  return allShips.length;
}

function isAdjacent(thisShipLoc, otherShips) {
  for (let i = 0; i < otherShips.length; i++) {
    let testShipColumn = otherShips[i][0];
    let testShipRow = otherShips[i][1];

    if (isAdjacentColumn(testShipColumn, thisShipLoc[0]) && isAdjacentRow(testShipRow, thisShipLoc[1])) {
      return true;
    }
  }
  alert("That placement is not adjacent to others of its kind.")
  return false;
}

function isInLine(thisShipsLoc, otherShips) {
  let otherShipsOrientation = getOrientation([otherShips[0], otherShips[1]]);
  let thisShipsOrientation = getOrientation([otherShips[0], thisShipsLoc])
  if (otherShipsOrientation === thisShipsOrientation) return true;
  alert("That placement is not in line with others of its kind.")
  return false;
}

function isAdjacentColumn(c1, c2) {
  if (
    String.fromCharCode(c1.charCodeAt(0) - 1) === c2 ||
    String.fromCharCode(c1.charCodeAt(0) + 1) === c2 ||
    c1 === c2
  ) {
    return true;
  }

  return false;
}

function isAdjacentRow(r1, r2) {
  if (r1 - 1 === r2 || r1 + 1 === r2 || r1 === r2) return true;

  return false;
}

function getOrientation(twoCells) {
  let firstCellC = twoCells[0][0];
  let firstCellR = twoCells[0][1];
  let secondCellC = twoCells[1][0];
  let secondCellR = twoCells[1][1];
  if (firstCellC === secondCellC) return "v";
  if (firstCellR === secondCellR) return "h";

  let firstCToNumber = firstCellC.charCodeAt(0);
  let secondCToNumber = secondCellC.charCodeAt(0);

  if (firstCToNumber - secondCToNumber === firstCellR - secondCellR) return "bd";
  if (firstCToNumber - secondCToNumber === -(firstCellR - secondCellR)) return "fd";
}

function newShipsWithoutThisLoc(c, r, ships) {
  let newShips = ships;
  for (let ship in ships) {
    for (let i = 0; i < ships[ship].locs.length; i++) {
      if (!ships[ship].locs[i]) continue;
      if (c === ships[ship].locs[i][0] && r === ships[ship].locs[i][1]) {
        newShips[ship].locs = [0];
        return newShips;
      }
    }
  }
}

function allShipsArePlaced(ships) {
  for (let e in ships) {
    if (!(ships[e].locs.length === ships[e].max)) {
      return false;
    }
  }
  return true;
}

function choosePlayerName(extraPrompt) {
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

function isShotAt(c, r, shots) {
  for (let turn = 0; turn < shots.length; turn++) {
    for (let i = 0; i < shots[turn].length; i++) {
      if (shots[turn][i][0] === c && shots[turn][i][1] === r) {
        return true;
      }
    }
  }

  return false;
}

function numberOfShotsYouGet(ships) {
  let shots = 6;
  for (let ships in ships) {
    if (ships[ship].locs[0] === 0) shots --;
  }

  return shots;
}

function indexOf(c, r, shots) {
  for (let shot in shots)
    if (shots[shot][0] === c && shots[shot][1] === r) {
      return shot;
    }
  return -1;
}
