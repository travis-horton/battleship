import { allPlayersShipsPlaced, whatShipIsHere } from "./ships.js";

export const shotsThisPlayerGets = (hitsOnThisPlayer, maxShips) => {
  let shots = 6;
  for (let ship in hitsOnThisPlayer) {
    if (hitsOnThisPlayer[ship] === maxShips[ship]) shots = ship === "b" ? shots - 2 : shots - 1;
  }
  return shots;
}

const isSameShot = (coord, prevShot) => {
  if (coord[0] === prevShot[0] && coord[1] === prevShot[1]) return true;
  return false;
}

const getNewState = (oldState, turn, name, newShotsThisTurn, shotCoord, addOrRemove = "remove") => {
  oldState.localInfo.shots[turn][name] = newShotsThisTurn;
  for (let board in oldState.localInfo.boardInfo) {
    const thisBoard = oldState.localInfo.boardInfo[board];
    if (thisBoard.config.style !== "ships") {
      thisBoard.data[shotCoord[0]][shotCoord[1]].shot = addOrRemove === "add" ? turn : false;
    }
  }
  return oldState;
}

export const shoot = (coord, state, self) => {
  const { localInfo, config, gameState } = state;
  const { name, shots, status, boardInfo, ships } = localInfo;
  const thisTurnNumber = gameState.turnNumber;
  const hits = gameState.players[name].hitsOnThisPlayer;
  let newShotsThisTurn = localInfo.shots[thisTurnNumber][name];

  for (let shot in newShotsThisTurn) {
    if (isSameShot(coord, newShotsThisTurn[shot])) {
      newShotsThisTurn.splice(shot, 1);
      self.setState(prevState => getNewState(prevState, thisTurnNumber, name, newShotsThisTurn, coord));
      return;
    }
  }

  if (newShotsThisTurn.length >= shotsThisPlayerGets(hits, config.maxShips)) {
    alert("You don't get any more shots!");
    return;
  }

  for (let turnNumber in shots) {
    for (let shot in shots[turnNumber][name]) {
      const thisShot = shots[turnNumber][name][shot]
      if (isSameShot(coord, thisShot)) {
        alert("You've already shot there!");
        return;
      }
    }
  }

  if (newShotsThisTurn[0] === 0) {
    newShotsThisTurn[0] = coord;
  } else {
    newShotsThisTurn.push(coord);
  }

  let newShots = shots;
  newShots[thisTurnNumber][name] = newShotsThisTurn;
  self.setState(prevState => getNewState(prevState, thisTurnNumber, name, newShotsThisTurn, coord, "add"));
}
