import React, { Component } from "react";

const getClassNames = (col, row, shot, potentialShots, color, headerCellLabel, style) => {
  const classNames = ["cell", color];

  if (shot !== false) classNames.push("shot");
  if (row === 0) classNames.push("toprow");
  if (col === 0) classNames.push("leftcol");
  if (headerCellLabel) classNames.push("header");
  for (let shot in potentialShots) {
    const thisShot = potentialShots[shot]
    if (thisShot[0] === row && thisShot[1] === col) classNames.push("potentialShot");  
  }

  return classNames.join(" ");
}

export default function Cell({
  style,
  row,
  col,
  data,
  potentialShots,
  headerCellLabel,
  handleCellInput,
  handleCellClick,
  handleCellRightClick
}) {
  const handleClick = e => {
    handleCellClick(row, col);
  };

  const handleInput = e => {
    e.preventDefault();
    handleCellInput(row, col, e.target.value.toLowerCase());
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    handleCellRightClick(row, col);
  };

  if (headerCellLabel || headerCellLabel === 0) {
    return (
      <span className={ "cell header" }>{ headerCellLabel }</span>
    )
  }

  const classNames = getClassNames(col, row, data.shot, potentialShots, data.color, headerCellLabel, style);

  switch (style) {
    case "input": {
      return <input onChange={ handleInput } className={ classNames } value={ data.ship }/>;
      break;
    }

    case "destination": {
      let val;
      if (data.shot !== false) val = data.shot;
      if (data.ship) val = data.ship;

      return (
        <span className={ classNames } onClick={ handleClick } onContextMenu={ handleRightClick }>
          { val } 
        </span>
      );
      break;
    }

    case "shooting": {
      return <span className={ classNames } onClick={ handleClick }/>;
      break;
    }

    default: {
      return (
        <span className={ classNames }>
          { data.ship }
        </span>
      );
    }
  }
};
