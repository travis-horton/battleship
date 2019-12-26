import React, { Component } from "react";
import { Cell } from "./cell";

export const Row = ({
  rowLength,
  boardStyle,
  row,
  cols,
  ships,
  shots,
  potentialShots,
  handleRowShipInput,
  handleRowShoot,
  playerName,

}) => {
  const handleCellShipInput = (c, r, val) => handleRowShipInput(c, r, val);
  const handleCellShoot = (c, r) => handleRowShoot(c, r);
  const className = "row";

  if (row === "header") {
    //make this a function 'return header column'
    return (
      <div className={className}>
        <Cell headerCellLabel=" "/>
        {
          cols.map((col) =>
            <Cell headerCellLabel={col} key={col}/>
          )
        }
        <Cell headerCellLabel=" "/>
      </div>
    );
  } else {
    return (
      <div className={className}>
        <Cell headerCellLabel={row}/>
        {
          cols.map((col) =>
            <Cell
              key={col}
              boardStyle={boardStyle}
              row={row}
              col={col}
              ships={ships}
              shots={shots}
              potentialShots={potentialShots}
              inputShip={handleCellShipInput}
              potentialShot={handleCellShoot}
            />
          )
        }
        <Cell headerCellLabel={row}/>
      </div>
    );
  }
}
