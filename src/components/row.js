import React, { Component } from "react";
import Cell from "./cell";

const headerRow = (className, length) => {
  return (
    <div className={ className }>
      <Cell headerCellLabel=" "/>
      {
        new Array(length).fill("").map((col, i) =>
          <Cell
            headerCellLabel={ String.fromCharCode(i + 65) }
            key={ i }
          />
        )
      }
      <Cell headerCellLabel=" "/>
    </div>
  );
}

export const Row = ({
  row,
  style,
  data,
  length,
  handleRowInput,
  handleRowClick,
}) => {
  const handleCellInput = (c, r, val) => handleRowInput(c, r, val);
  const handleCellClick = (c, r) => handleRowClick(c, r);
  const className = "row";

  if (row === "header") {
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
