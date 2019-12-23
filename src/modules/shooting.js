import { allPlayersShipsPlaced } from "./ships.js";

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

// you're working here -- trying to iterate over non-iterable?
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

export const shoot = (self, db) => {
  let playerName = self.state.playerName;
  let shots = self.state.shots[playerName];
  let turn = self.state.turn;
  let numOfShots = numberOfShotsYouGet(self.state.ships);
  let thisPlayersShots = [...self.state.shots[self.state.playerName]];

  if (shots[turn].length < numOfShots || !shots[turn]) {
    let howManyShots = shots[turn].length;
    if (!howManyShots) howManyShots = 0;
    alert(`You get ${numOfShots} shots!\nYou've only shot ${howManyShots} ${howManyShots === 1 ? "time" : "times"}.`);
    return;
  }

  if (!allPlayersShipsPlaced(self.state.players, self.state.numPlayers)) {
    alert("Waiting on other players to join/add ships.");
    return;
  }

  if (!playerName.turn) {
    // should probably say whose turn it is
    alert("It's not your turn!");
    return;
  }

  if (!confirm("Are you happy with your shots?")) {
    return;
  }

  db.ref(`${self.state.gameId}/shots/${self.state.playerName}/${thisTurn}`).set(
    thisPlayersShots[thisTurn]
  );


  //do some stuff with firebase to update shots and boards...
  console.log("fire ze missiles!");
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
