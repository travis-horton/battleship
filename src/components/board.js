import React, {Component} from 'react';
import { Row } from "./row";

const objectWithoutKey = (object, key) => {
  const {[key]: deletedKey, ...otherKeys} = object;
  let newObject = []
  for (let person in otherKeys) {
    newObject.push(...otherKeys[person])
  }
  return newObject;
}

export const Board = ({
  boardSize,
  boardStyle,
  boardOwner,
  shots,
  ships,
  thisPlayer,
  potentialShots,
  handleBoardShipInput,
  handleBoardShoot,
}) => {
  const handleRowShipInput = (c, r, val) => handleBoardShipInput(c, r, val);
  const handleRowShoot = (c, r) => handleBoardShoot(c, r);

  const rows = [...Array(boardSize).keys()];
  const cols = [...Array(boardSize).keys()].map(el => String.fromCharCode(el + 65)); //generates an array of letters from "A" board size in length
  
  let playerLabel = (
    boardOwner === "shooting" ?
    "your shooting board" :
    boardOwner + "'s board"
  )

  if (boardOwner === thisPlayer && boardStyle !== "input") {
    playerLabel = "your ships";
  }

  return (
    <span className="board">
      <span>{playerLabel}</span>
      <Row
        rowLength={boardSize}
        cols={cols}
        row="header"
      />
      {
        rows.map((row) =>
          <Row
            rowLength={boardSize}
            boardStyle={boardStyle}
            key={row}
            row={row + 1}
            cols={cols}
            ships={ships}
            shots={shots}
            potentialShots={potentialShots}
            handleRowShipInput={handleRowShipInput}
            handleRowShoot={handleRowShoot}
            playerName={playerLabel}
          />
        )
      }
      <Row
        rowLength={boardSize}
        cols={cols}
        row="header"
      />
    </span>
  )

}

