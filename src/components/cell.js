import React, { Component } from "react";

const getClassNames = (col, row, shot, color, headerCellLabel, style) => {
  const classNames = ["cell", color];

  if (shot) classNames.push("shot");
  if (row === 0) classNames.push("toprow");
  if (col === 0) classNames.push("leftcol");
  if (headerCellLabel) classNames.push("header");

  return classNames.join(" ");
}

export default function Cell({
  style,
  row,
  col,
  data,
  headerCellLabel,
  handleCellInput,
  handleCellClick,
  handleCellRightClick
}) {
  const handleInput = e => {
    e.preventDefault();
    handleCellInput(row, col, e.target.value.toLowerCase());
  }

  const handleClick = (row, col) => handleCellClick(r, c);
  const handleRightClick = (e) => {
    e.preventDefault();
    handleCellRightClick(row, col);
  }

  if (headerCellLabel || headerCellLabel === 0) {
    return (
      <span className={ "cell header" }>{ headerCellLabel }</span>
    )
  }

  const classNames = getClassNames(col, row, data.shot, data.color, headerCellLabel, style);

  if (style === "input") {
    return (
      <input
        onChange={ handleInput }
        className={ classNames }
        value={ data.ship }
      />
    );

  } else if (style === "destination") {
    let val;
    if (data.shot) val = data.shot;
    if (data.ship) val = data.ship;

    return (
      <input
        onChange={ handleInput }
        className={ classNames }
        value={ val }
        onClick={ handleClick }
        onContextMenu={ handleRightClick }
      />
    );

  } else {
    return (
      <span className={ classNames } onClick={ handleClick }>
        { data.ship }
      </span>
    );

  }
}
