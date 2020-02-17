const isShip = (value) => {
  const regex = /^[ABCDSabcds]$/;
  if (regex.test(value) || value === '') return true;
  return false;
};

const isAdjacent = (thisShipLoc, shipsOfThisType) => {
  for (let i = 0; i < shipsOfThisType.length; i += 1) {
    if (
      Math.abs(thisShipLoc[0] - shipsOfThisType[i][0]) < 2
      && Math.abs(thisShipLoc[1] - shipsOfThisType[i][1]) < 2
    ) {
      return true;
    }
  }

  alert('That placement is not adjacent to others of its kind.');
  return false;
};

const getOrientation = (shipOne, shipTwo) => {
  if (shipOne[0] === shipTwo[0]) return 'h';
  if (shipOne[1] === shipTwo[1]) return 'v';
  if (shipOne[0] - shipTwo[0] === shipOne[1] - shipTwo[1]) return 'bd';
  if (shipOne[0] - shipTwo[0] === -(shipOne[1] - shipTwo[1])) return 'fd';
  return 'something went wrong';
};

const isInLine = (thisShipsLoc, otherShips) => {
  const thisShipsOrientation = getOrientation(thisShipsLoc, otherShips[0]);
  const otherShipsOrientation = getOrientation(otherShips[0], otherShips[1]);
  if (otherShipsOrientation === thisShipsOrientation) return true;
  alert('That placement is not in line with others of its kind.');
  return false;
};

export const isValidShipPlacement = (r, c, thisShip, data, config) => {
  if (!isShip(thisShip)) {
    alert('Must be a ship letter (a, b, c, d, or s).');
    return false;
  }

  if (thisShip === '') return true;

  // get total of this ship on board
  const shipsOfThisType = [];
  for (let i = 0; i < config.size; i += 1) {
    for (let j = 0; j < config.size; j += 1) {
      if (data[i][j].ship === thisShip) shipsOfThisType.push([i, j]);
    }
  }

  // check if already max ships of type
  if (shipsOfThisType.length >= config.maxShips[thisShip]) {
    alert(
      `You can only place ${config.maxShips[thisShip]} "${thisShip}"${shipsOfThisType.length === 1 ? '' : 's'} and you've already placed ${shipsOfThisType.length}.`,
    );
    return false;
  }

  // if no other ships of this type, can go anywhere
  if (shipsOfThisType.length === 0) return true;

  // if one other ship of this type, has to go next to that ship
  if (shipsOfThisType.length === 1) return isAdjacent([r, c], shipsOfThisType);
  return (isAdjacent([r, c], shipsOfThisType) && isInLine([r, c], shipsOfThisType));
};

export const getShipsLocs = (data) => {
  const shipsLocs = {
    a: [], b: [], c: [], s: [], d: [],
  };
  const size = data.length;

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      if (data[i][j].ship) shipsLocs[data[i][j].ship].push([i, j]);
    }
  }
  return shipsLocs;
};

export const allShipsArePlaced = (shipsPlaced, maxShips) => {
  let value = true;
  const ships = shipsPlaced.keys();
  ships.forEach((ship) => {
    if (maxShips[ship] !== shipsPlaced[ship].length) value = false;
  });
  return value;
};

export const removeAllOfThisShipFromData = (ship, newData) => {
  const { length } = newData;
  for (let i = 0; i < length; i += 1) {
    for (let j = 0; j < length; j += 1) {
      if (newData[i][j].ship === ship) newData[i][j].ship = '';
    }
  }
  return newData;
};

export const allThisPlayersShipsArePlaced = (ships, maxShips) => {
  let value = true;
  const shipType = ships.keys();
  shipType.forEach((ship) => {
    if (ships[ship].length < maxShips[ship]) value = false;
  });
  return value;
};

export const allPlayersShipsPlaced = (players, maxPlayers) => {
  let value = true;
  const numPlayers = Object.keys(players).length;
  if (numPlayers < maxPlayers) return false;
  const playerNames = players.keys();
  playerNames.forEach((p) => {
    if (!players[p].shipsAreCommitted) value = false;
  });
  return value;
};
