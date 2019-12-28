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
  player,
  ships = {},
  shots = {},
  potentialShots = {},
  inputShip,
  commitShips,
  handleClick,
  handleShoot,
  players = {},
}) {
  const handleBoardAreaShipInput = (c, r, val) => inputShip("input", { loc, val });
  const handleBoardAreaCommitShips = (e) => commitShips("commit", { e });
  const handleBoardAreaShoot = (c, r) => handleClick(c, r);
  const handleBoardAreaCommitShots = (e) => handleShoot(e);

  if (!player.shipsCommitted) {
    return (
        <div className="right_column">
          <Board
            boardSize={ boardSize }
            boardStyle="input"
            handleBoardShipInput={ handleBoardAreaShipInput }
            boardOwner={ player.name }
            ships={ ships }
            thisPlayer={ player.name }
            handleBoardShoot={ () => {} }
          />
          <br/>
          <button onClick={ handleBoardAreaCommitShips }>Submit ship placement</button>
        </div>
    )
  }

  return (
    <div>
      <div className="board_area">
        <Board
          boardSize={ boardSize }
          boardOwner={"shooting"}
          potentialShots={ potentialShots }
          thisPlayer={ player.name }
          handleBoardShoot={ handleBoardAreaShoot }
        />
        <Board
          boardSize={ boardSize }
          boardOwner={ player.name }
          ships={ ships }
          shots={ getBoardShots(shots, player.name)}
          potentialShots={ potentialShots }
          thisPlayer={ player.name }
          handleBoardShoot={ () => {} }
        />
      </div>
      <div>
        <button onClick={ handleBoardAreaCommitShots }>Fire ze missiles!</button>
      </div>
      <div className="board_area">
        {
          players.map((boardOwner) =>
            <Board
              key={ boardOwner }
              boardSize={ boardSize }
              boardOwner={ boardOwner }
              shots={ getBoardShots(shots, boardOwner)}
              potentialShots={ potentialShots }
              thisPlayer={ player.name }
              handleBoardShoot={ () => {} }
            />
          )
        }
      </div>
    </div>
  )
}

