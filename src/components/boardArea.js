import React, { Component } from "react";
import { Board } from "./board";

const getBoardShots = (shots, boardOwner) => {
  let thisBoardShots = [];
  for (let p in shots) {
    if (p !== boardOwner && shots[p]) {
      shots[p].forEach((turn) => {
        thisBoardShots.push(...turn);
      })
    }
  }
  return thisBoardShots;
}

export default function BoardArea({
  boardSize,
  name,
  ships = {},
  shots = {},
  potentialShots = {},
  inputShip,
  commitShips,
  handleClick,
  handleShoot,
}) {
  const handleBoardAreaShipInput = (c, r, val) => inputShip("input", { loc, val });
  const handleBoardAreaCommitShips = (e) => commitShips("commit", { e });
  const handleBoardAreaShoot = (c, r) => handleClick(c, r);
  const handleBoardAreaCommitShots = (e) => handleShoot(e);

  if (!shipsCommitted) {
    return (
        <div className="right_column">
          <Board
            size={ boardSize }
            style="input"
            handleBoardShipInput={ handleBoardAreaShipInput }
            owner={ name }
            thisPlayer={ name }
            handleBoardShoot={ () => {} }
          />
          <br/>
          <button onClick={ handleBoardAreaCommitShips }>Submit ship placement</button>
        </div>
    )
  }

  return (
    <p>Ready for shooting.</p>
  )
}

