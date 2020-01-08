import React, { Component } from 'react';

const isPotentialShot = (r, c, potentialShots) => {
  for (let shot in potentialShots) {
    const thisShot = potentialShots[shot]
    if (thisShot[0] === r && thisShot[1] === c) return true;
  }
}

const getClassNames = (row, col, shot, potentialShots, color, headerCellLabel, style, playerColors) => {
  const classNames = ['cell', color];

  if (shot !== false) classNames.push(playerColors[shot.shooter]);
  if (row === 0) classNames.push('toprow');
  if (col === 0) classNames.push('leftcol');
  if (headerCellLabel) classNames.push('header');
  if (isPotentialShot(row, col, potentialShots)) classNames.push('potentialShot');
  return classNames.join(' ');
}

export default function Cell({
  style,
  row,
  col,
  data,
  turn,
  potentialShots,
  playerColors,
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
      <span className={ 'cell header' }>{ headerCellLabel }</span>
    )
  }

  const classNames = getClassNames(row, col, data.shot, potentialShots, data.color, headerCellLabel, style, playerColors);

  switch (style) {
    case 'input': {
      return <input onChange={ handleInput } className={ classNames } value={ data.ship }/>;
      break;
    }

    case 'destination': {
      let val;
      if (isPotentialShot(row, col, potentialShots)) val = turn;
      if (data.shot !== false) val = Number(data.shot.turn) + 1;
      if (data.ship) val = data.ship;

      return (
        <span className={ classNames } onClick={ handleClick } onContextMenu={ handleRightClick }>
          { val } 
        </span>
      );
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
