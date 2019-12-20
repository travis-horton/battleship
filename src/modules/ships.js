const crossingShip = (thisShip, allLocsOfShips) => {
  if (thisShip === "s") return true;
  //check bottom left box
  //allLocsOfShips = [["","",""],["a",etc...

  //change these numbers for different directions
  if (allLocsOfShips[2,0] === thisShip && allLocsOfShips[1,0] == allLocsOfShips[2,1]) return false;
  if (allLocsOfShips[2,0] === thisShip && allLocsOfShips[1,0] == allLocsOfShips[2,1]) return false;
  if (allLocsOfShips[2,0] === thisShip && allLocsOfShips[1,0] == allLocsOfShips[2,1]) return false;
  if (allLocsOfShips[2,0] === thisShip && allLocsOfShips[1,0] == allLocsOfShips[2,1]) return false;
}

const isAdjacent = (thisShipLoc, otherShips) => {
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

const isInLine = (thisShipsLoc, otherShips) => {
  let otherShipsOrientation = getOrientation([otherShips[0], otherShips[1]]);
  let thisShipsOrientation = getOrientation([otherShips[0], thisShipsLoc])
  if (otherShipsOrientation === thisShipsOrientation) return true;
  alert("That placement is not in line with others of its kind.")
  return false;
}

const isAdjacentColumn = (c1, c2) => {
  if (
    String.fromCharCode(c1.charCodeAt(0) - 1) === c2 ||
    String.fromCharCode(c1.charCodeAt(0) + 1) === c2 ||
    c1 === c2
  ) {
    return true;
  }

  return false;
}

const isAdjacentRow = (r1, r2) => {
  if (r1 - 1 === r2 || r1 + 1 === r2 || r1 === r2) return true;

  return false;
}

const getOrientation = (twoCells) => {
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

export const whatShipIsHere = (c, r, ships) => {
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

const isShip = (value) => {
  let regex = /^[ABCDSabcds]$/
  if (regex.test(value)) return true;
  return false;
}

const thisShipCanGoHere = (thisShip, c, r, allShipsOfType) => {
  let thisShipLoc = [c, r]
  //check if there are no ships of type (can go anywhere) or max ships of type (can't go anywhere)
  let countOfThisShip = allShipsOfType.locs[0] === 0 ? 0 : allShipsOfType.locs.length;
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

const newShipsWithoutThisLoc = (c, r, ships) => {
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

export const allShipsArePlaced = (ships) => {
  for (let e in ships) {
    if (!(ships[e].locs.length === ships[e].max)) {
      return false;
    }
  }
  return true;
}

export const allPlayersShipsPlaced = (players, maxPlayers) => {
  let numPlayers = Object.keys(players).length;
  if (numPlayers < maxPlayers) return false;
  for (let p in players) {
    if (!players[p].shipsCommitted) {
      return false;
    }
  }
  return true;
}

export const inputShip = (c, r, val, self) => {
  if (val.length === 0) {
    let newShips = newShipsWithoutThisLoc(c, r, self.state.ships);
    self.setState({
      ships: newShips
    })
    return;
  }

  if (!isShip(val)) {
    alert(`"${val}" is not a ship letter (a, b, c, s, or d).`);
    return false;
  }

  if (thisShipCanGoHere(val, c, r, self.state.ships[val])) {
    let newShips = self.state.ships;
    if (newShips[val].locs[0] === 0) {
      newShips[val].locs[0] = [c, r];

    } else {
      newShips[val].locs.push([c, r]);
    }

    self.setState({
      ships: newShips
    });
  }
}

export const randomizeTurnOrder = (players) => {
  const playerArray = [];
  for (let player in players) {
    playerArray.push(player);
  }
  return shuffle(playerArray);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
