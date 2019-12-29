import React, { Component } from 'react';
import Cell from './cell';

const headerRow = (className, length) => {
  const headers = [];
  for (let i = 0; i < length; i++) {
    headers.push(
      <Cell
        headerCellLabel={ String.fromCharCode(i + 65) }
        key={ i }
      />
    );
  }
  return (
    <div className={ className }>
      <Cell headerCellLabel=' '/>
      { headers }
      <Cell headerCellLabel=' '/>
    </div>
  );
}

export default function Row({
  row,
  style,
  data,
  length,
  handleRowInput,
  handleRowClick,
}) {
  const handleCellInput = (c, r, val) => handleRowInput(c, r, val);
  const handleCellClick = (c, r) => handleRowClick(c, r);
  const className = 'row';

  if (row === 'header') {
    return headerRow(className, length);
  } else {
    return (
      <div className={ className }>
        <Cell headerCellLabel={ row + 1 } key={ -1 }/>
        {
          data.map((col, i) =>
            <Cell
              key={ i }
              style={ style }
              row={ row }
              col={ i }
              data={ col }
              handleCellInput={ handleCellInput }
              handleCellClick={ handleCellClick }
            />
          )
        }
        <Cell headerCellLabel={ row + 1 } key={ data.length }/>
      </div>
    );
  }
}
