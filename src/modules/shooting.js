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

const newStateWithShot = (oldState, turn, name, newShotsThisTurn, shotCoord, addOrRemove = "remove") => {
  oldState.localInfo.potentialShots = newShotsThisTurn;
  for (let board in oldState.localInfo.boardInfo) {
    const thisBoard = oldState.localInfo.boardInfo[board];
    if (thisBoard.config.style !== "ships") {
      thisBoard.data[shotCoord[0]][shotCoord[1]].shot = addOrRemove === "add" ? turn : false;
    }
  }
  return oldState;
}

export const generateNewStateWithShot = (coord, state, self) => {
  const { localInfo, config, gameState } = state;
  const { name, shots, status, boardInfo, ships } = localInfo;
  const thisTurnNumber = gameState.turnNumber;
  const hits = gameState.players[name].hitsOnThisPlayer;
  let newShotsThisTurn = localInfo.potentialShots;

  for (let shot in newShotsThisTurn) {
    if (isSameShot(coord, newShotsThisTurn[shot])) {
      newShotsThisTurn.splice(shot, 1);
      return newStateWithShot(state, thisTurnNumber, name, newShotsThisTurn, coord);
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

  return newStateWithShot(state, thisTurnNumber, name, newShotsThisTurn, coord, "add");
}

export const getNewGameStateAfterShooting = (state, name, hits) => {
  const newGameState = { ...state };
  const { turnOrder } = newGameState;
  let curPlayerIndex = turnOrder.indexOf(name);
  let nextPlayer;

  if (curPlayerIndex + 1 === turnOrder.length) {
    nextPlayer = turnOrder[0];
    newGameState.turnNumber++;
  } else {
    nextPlayer = turnOrder[curPlayerIndex + 1];
  }

  for (let player in newGameState.players) {
    newGameState.players[player].hitsOnThisPlayer = hits[player];
  }

  newGameState.players[name].thisPlayerTurn = false;
  newGameState.players[nextPlayer].thisPlayerTurn = true;

  return newGameState;
}

export const getHits = (shots, ships, hits, shooter, turn) => {
  for (const player in ships) {
    if (player === shooter) continue;
    for (const ship in ships[player]) {
      for (const shipLoc in ships[player][ship]) {
        for (const shot in shots) {
          const thisShot = shots[shot];
          const thisShip = ships[player][ship][shipLoc];
          if (thisShot[0] === thisShip[0] && thisShot[1] === thisShip[1]) {
            if (hits[player][ship][0] === false) {
              hits[player][ship][0] = { turn, shooter }
            } else {
              hits[player][ship].push({
                turn, shooter,
              });
            }
          }
        }
      }
    }
  }

  return hits;
}

