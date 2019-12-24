import { allPlayersShipsPlaced, whatShipIsHere } from "./ships.js";

export const isShotAt = (c, r, shots) => {
  for (let i = 0; i < shots.length; i++) {
    if (shots[i][0] === c && shots[i][1] === r) {
      return true;
    }
  }
  return false;
}

export const numberOfShotsYouGet = (ships) => {
  let shots = 6;
  for (let ships in ships) {
    if (ships[ship].locs[0] === 0) shots --;
  }
  return shots;
}

const indexOfShot = (c, r, shots) => {
  for (let shot in shots)
    if (shots[shot][0] === c && shots[shot][1] === r) {
      return shot;
    }
  return -1;
}

export const generateNewShots = (c, r, shots, numShots) => {
  if (isShotAt(c, r, shots)) {
    shots.splice(indexOfShot(c, r, shots), 1);

  } else if (shots.length === 0) {
    shots = [[c, r]]

  } else if (shots.length >= numShots) {
    alert(`You only get ${numShots} shots.`);

  } else {
    shots.push([c, r]);
  }

  return shots;
}

export const getAllShotsByTurn = (shots) => {
  const shotsByTurn = [];
  for (let player in shots) {
    for (let turn in shots[player]) {
      if (!shotsByTurn[turn]) shotsByTurn[turn] = {};
      shotsByTurn[turn][player] = shots[player][turn];
    }
  }
  return shotsByTurn;
}

export const getHits = (shots, ships, shooter) => {
  let hits = {};
  for (let player in ships) {
    if (player !== shooter) {
      hits[player] = [];
      for (let shot in shots) {
        hits[player].push(whatShipIsHere(shots[shot][0], shots[shot][1], ships[player]) || null);
      }
      hits[player] = hits[player].filter( el => (el != null));
      if (hits[player].length === 0) {
        hits[player].push("NONE");
      }
    } else {
      hits[player] = ["n/a"];
    }
  }
  return hits
}
