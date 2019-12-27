import React, { Component } from "react";
import { whatShipIsHere } from "../modules/ships.js";
import { isShotAt } from "../modules/shooting.js";

const getClassNames = (col, row, shots, potentialShots, headerCellLabel) => {
  const classNames = ["cell"];

  if (potentialShots && isShotAt(col, row, potentialShots)) {
    classNames.push("potentialshot");
  }

  if (shots && isShotAt(col, row, shots)) {
    classNames.push("shot");
  }

  if (row === 1) {
    classNames.push("toprow");
  }

  if (col === "A") {
    classNames.push("leftcol");
  }

  if (headerCellLabel) {
    classNames.push("header");
  }

  return classNames.join(" ");
}

export default function Cell({
  boardStyle,
  row,
  col,
  ships,
  shots,
  potentialShots,
  headerCellLabel,
  inputShip,
  potentialShot
}) {
  const classNames = getClassNames(col, row, shots, potentialShots, headerCellLabel);
  const shipType = whatShipIsHere(col, row, ships);
  const handleInput = e => {
    e.preventDefault();
    inputShip(col, row, e.target.value.toLowerCase());
  }

  if (headerCellLabel) {
    return (
      <span className={classNames}>{headerCellLabel}</span>
    )

  } else if (boardStyle === "input") {
    return (
      <input
        onChange={handleInput}
        className={classNames}
        value={shipType}
      />
    )

  } else {
    const handleClick = () => potentialShot(col, row);
    return (
      <span className={classNames} onClick={handleClick}>
        {shipType}
      </span>
    )
  }
}
