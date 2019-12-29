import React, { Component } from "react";

const getClassNames = (col, row, shot, headerCellLabel, style) => {
  const classNames = ["cell"];
  
  if (shot) {
    classNames.push(style = shooting ? "potentialshot" : "shot");
  }

  if (row === 0) {
    classNames.push("toprow");
  }

  if (col === 0) {
    classNames.push("leftcol");
  }

  if (headerCellLabel) {
    classNames.push("header");
  }

  return classNames.join(" ");
}

export default function Cell({
  style,
  row,
  col,
  data,
  headerCellLabel,
  handleCellInput,
  handleCellClick
}) {
  const handleInput = e => {
    e.preventDefault();
    handleCellInput(row, col, e.target.value.toLowerCase());
  }

  if (headerCellLabel || headerCellLabel === 0) {
    return (
      <span className={ "cell header" }>{ headerCellLabel }</span>
    )
  }

  if (data === undefined) console.log(style, row, col, headerCellLabel);
  const classNames = getClassNames(col, row, data.shot, headerCellLabel, style);

  if (style === "input") {
    return (
      <input
        onChange={ handleInput }
        className={ classNames }
        value={ data.ship }
      />
    )

  } else {
    const handleClick = () => handleClick(col, row);
    return (
      <span className={ classNames } onClick={ handleClick }>
        { data.ship }
      </span>
    )
  }
}
