export function isShotAt(c, r, shots) {
  for (let turn = 0; turn < shots.length; turn++) {
    for (let i = 0; i < shots[turn].length; i++) {
      if (shots[turn][i][0] === c && shots[turn][i][1] === r) {
        return true;
      }
    }
  }

  return false;
}

export function numberOfShotsYouGet(ships) {
  let shots = 6;
  for (let ships in ships) {
    if (ships[ship].locs[0] === 0) shots --;
  }

  return shots;
}

export function indexOfShot(c, r, shots) {
  for (let shot in shots)
    if (shots[shot][0] === c && shots[shot][1] === r) {
      return shot;
    }
  return -1;
}
