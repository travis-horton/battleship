import { allPlayersShipsPlaced, whatShipIsHere } from "./ships.js";

export const shotsThisPlayerGets = (hitsOnThisPlayer, maxShips) => {
  let shots = 6;
  for (let ship in hitsOnThisPlayer) {
    if (hitsOnThisPlayer[ship].length === maxShips[ship]) shots = ship === "b" ? shots - 2 : shots - 1;
  }
  return shots;
}

const isSameShot = (coord, prevShot) => {
  if (coord[0] === prevShot[0] && coord[1] === prevShot[1]) return true;
  return false;
}

const newStateWithShot = (oldState, turn, name, newShotsThisTurn, shotCoord, addOrRemove = "remove") => {
  oldState.localInfo.potentialShots = newShotsThisTurn;
  let turnToAdd = turn;
  if (oldState.gameState.shots[turn] && oldState.gameState.shots[turn][name][0]) turnToAdd++;
  for (let board in oldState.localInfo.boardInfo) {
    const thisBoard = oldState.localInfo.boardInfo[board];
    if (thisBoard.config.style !== "ships") {
      thisBoard.data[shotCoord[0]][shotCoord[1]].shot = addOrRemove === "add" ? turnToAdd : false;
    }
  }
  return oldState;
}

export const generateNewStateWithShot = (coord, state, self) => {
  const { localInfo, config, gameState } = state;
  const { name, status, boardInfo, ships } = localInfo;
  const { shots } = gameState;
  const thisTurnNumber = gameState.turnNumber;
  const hits = gameState.players[name].hitsOnThisPlayer;
  let newShotsThisTurn = localInfo.potentialShots;

  for (let turnNumber in shots) {
    for (let shot in shots[turnNumber][name]) {
      const thisShot = shots[turnNumber][name][shot]
      if (isSameShot(coord, thisShot)) {
        alert("You've already shot there!");
        return;
      }
    }
  }

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

  if (newShotsThisTurn[0] === 0) {
    newShotsThisTurn[0] = coord;
  } else {
    newShotsThisTurn.push(coord);
  }

  return newStateWithShot(state, thisTurnNumber, name, newShotsThisTurn, coord, "add");
}

export const getNewGameStateAfterShooting = (gameState, shotsToAdd, name, hits) => {
  const newGameState = { ...gameState };
  newGameState.shots[gameState.turnNumber][name] = shotsToAdd;

  const { turnOrder, turnNumber } = newGameState;
  let curPlayerIndex = turnOrder.indexOf(name);
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
  for (let player in newGameState.players) {
    newGameState.players[player].hitsOnThisPlayer = hits[player];
    if (!newGameState.shots[turnNumber + 1][player]) {
      newGameState.shots[turnNumber + 1][player] = [0];
    }
  }

  newGameState.players[name].thisPlayerTurn = false;
  newGameState.players[nextPlayer].thisPlayerTurn = true;

  return newGameState;
}

export const getHits = (shots, ships, hits, shooter, turn, maxShips) => {
  let humanShipNames = {
    a: "aircraft carrier",
    b: "battleship",
    c: "cruiser",
    d: "destroyer",
    s: "submarine",
  }

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
              if (hits[player][ship].length === maxShips[ship]) {
                alert(`You sunk ${ player }'s ${ humanShipNames[ship] }!!`);
              }
            }
          }
        }
      }
    }
  }

  return hits;
}

