import React, {Component} from 'react';
import Row from "./row";

const objectWithoutKey = (object, key) => {
  const {[key]: deletedKey, ...otherKeys} = object;
  let newObject = []
  for (let person in otherKeys) {
    newObject.push(...otherKeys[person])
  }
  return newObject;
}

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleInput(c, r, val) {
    this.props.handleInput(c, r, val);
  }

  handleClick(c, r) {
    this.props.handleClick(c, r);
  }

  render() {
    let rows = [];
    let cols = [];
    let playerLabel = (
      this.props.boardOwner === "shooting" ?
      "your shooting board" :
      this.props.boardOwner + "'s board"
    )

    if (this.props.boardOwner === this.props.thisPlayer && this.props.boardStyle !== "input") {
      playerLabel = "your ships";
    }

    let ships = (
      this.props.boardOwner === this.props.thisPlayer ?
      this.props.ships :
      []
    );

    let shots = [];
    for (let e in this.props.shots) {
      if (e !== this.props.boardOwner) {
        shots.push(...this.props.shots[e])
      }
    }

    if (this.props.boardStyle === "input") {
      playerLabel = "place your ships";
      shots = [];
    }

 
    for (let i = 0; i < this.props.boardSize; i++) {
      rows.push(i);
    }
    for (let i = 0; i < this.props.boardSize; i++) {
      cols.push(String.fromCharCode(i + 65))
    }

    return (
      <span className="board">
        <span>{playerLabel}</span>
        <Row
          rowLength={this.props.boardSize}
          cols={cols}
          row="header"
        />
        {
          rows.map((row) =>
            <Row
              rowLength={this.props.boardSize}
              boardStyle={this.props.boardStyle}
              key={row}
              row={row + 1}
              cols={cols}
              ships={ships}
              shots={shots}
              handleInput={this.handleInput}
              handleClick={this.handleClick}
              playerName={playerLabel}
            />
          )
        }
        <Row
          rowLength={this.props.boardSize}
          cols={cols}
          row="header"
        />
      </span>
    )
  }
}
