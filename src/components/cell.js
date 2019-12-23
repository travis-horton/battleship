import React, { Component } from "react";
import { whatShipIsHere } from "../modules/ships.js";
import { isShotAt } from "../modules/shooting.js";

const getClassNames = (col, row, shots, potentialShots, label) => {
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

  if (label) {
    classNames.push("header");
  }

  return classNames.join(" ");
}

const Cell = ({
  row,
  col,
  shots,
  label,
  boardStyle,
  ships,
  handleInput,
  handleClick
}) => {
  const handleInputChange = e => {
    e.preventDefault();
    handleInput(col, row, e.target.value.toLowerCase());
  }
  const handleSpanClick = () => handleClick(col, row);

  if (label) {
    return (
      <span className={classNames}>{label}</span>
    )
  } else if (boardStyle === "input") {
    return (
      <input
        onChange={handleInputChange}
        className={classNames}
        value={shipType}
      />
    )
  } else {
    return (
      <span className={classNames} onClick={handleSpanClick}>
        {val}
      </span>
    )
  }
}

export default class Cel2l extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleInput(e) {
    e.preventDefault();
    this.props.handleInput(this.props.col, this.props.row, e.target.value.toLowerCase());
  }

  handleClick(e) {
    this.props.handleClick(this.props.col, this.props.row);
  }

  render() {
    let col = this.props.col;
    let row = this.props.row;
    let val = whatShipIsHere(col, row, this.props.ships);
    let className = getClassNames(col, row, this.props.shots, this.props.potentialShots, this.props.label);;

    if (this.props.label) {
      return (
        <span className={className}>{this.props.label}</span>
      )
    } else if (this.props.boardStyle === "input") {
      return (
        <input
          onChange={this.handleInput}
          className={className}
          value={val}
        />
      )
    } else {
      return (
        <span
          className={className}
          onClick={this.handleClick}
        >{val}</span>
      )
    }
  }
}
