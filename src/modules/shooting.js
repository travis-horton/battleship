export const isShotAt = (c, r, shots) => {
  for (let turn = 0; turn < shots.length; turn++) {
    for (let i = 0; i < shots[turn].length; i++) {
      if (shots[turn][i][0] === c && shots[turn][i][1] === r) {
        return true;
      }
    }
  }

  return false;
}

const numberOfShotsYouGet = (ships) => {
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

export const inputShot = (c, r, db, self) => {
  let thisPlayersShots = [...self.state.shots[self.state.playerName]];
  let thisTurn = self.state.turn;

  if (isShotAt(c, r, thisPlayersShots)) {
    thisPlayersShots[thisTurn].splice(indexOfShot(c, r, thisPlayersShots[thisTurn]), 1);

  } else if (thisPlayersShots[thisTurn] === 0) {
    thisPlayersShots[thisTurn] = [[c, r]]

  } else if (thisPlayersShots[thisTurn].length >= numberOfShotsYouGet(self.state.ships)) {
    alert(`You only get ${numberOfShotsYouGet(self.state.ships)} shots.`);

  } else {
    thisPlayersShots[self.state.turn].push([c, r]);
  }

  db.ref(`${self.state.gameId}/shots/${self.state.playerName}/${thisTurn}`).set(
    // keep the database from deleting entry if empty array
    thisPlayersShots[thisTurn].length > 0 ? 
    thisPlayersShots[thisTurn] :
    [0]
  );

}

export const shoot = (self, db) => {
  let playerName = self.state.playerName;
  let shots = self.state.shots[playerName];
  let turn = self.state.turn;
  let numOfShots = numberOfShotsYouGet(self.state.ships);

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

  //do some stuff with firebase to update shots and boards...
  console.log("fire ze missiles!");
}
