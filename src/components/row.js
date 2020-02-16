import React, { Component } from 'react';
import Cell from './cell';

const headerRow = (className, length) => {
  const headers = [];
  for (let i = 0; i < length; i++) {
    headers.push(
      <Cell
        headerCellLabel={String.fromCharCode(i + 65)}
        key={i}
      />,
    );
  }
  return (
    <div className={className}>
      <Cell headerCellLabel=" " />
      { headers }
      <Cell headerCellLabel=" " />
    </div>
  );
};

export default function Row({
  row,
  style,
  data,
  turn,
  potentialShots,
  length,
  playerColors,
  handleRowInput,
  handleRowClick,
  handleRowRightClick,
}) {
  const handleCellInput = (r, c, val) => handleRowInput(r, c, val);
  const handleCellClick = (r, c) => {
    handleRowClick(r, c);
  };
  const handleCellRightClick = (r, c) => handleRowRightClick(r, c);
  const className = 'row';

  if (row === 'header') {
    return headerRow(className, length);
  }
  return (
    <div className={className}>
      <Cell headerCellLabel={row + 1} key={-1} />
      {
          data.map((col, i) => (
            <Cell
              key={i}
              style={style}
              row={row}
              col={i}
              data={col}
              turn={turn}
              playerColors={playerColors}
              potentialShots={potentialShots}
              handleCellInput={handleCellInput}
              handleCellClick={handleCellClick}
              handleCellRightClick={handleCellRightClick}
            />
          ))
        }
      <Cell headerCellLabel={row + 1} key={data.length} />
    </div>
  );
}
