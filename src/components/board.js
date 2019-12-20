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
    let _p = this.props;
    let playerLabel = (
      _p.boardOwner === "shooting" ?
      "your shooting board" :
      _p.boardOwner + "'s board"
    )

    if (_p.boardOwner === _p.thisPlayer && _p.boardStyle !== "input") {
      playerLabel = "your ships";
    }

    let ships = (
      _p.boardOwner === _p.thisPlayer ?
      _p.ships :
      []
    );

    let shots = _p.shots;

    for (let i = 0; i < _p.boardSize; i++) {
      rows.push(i);
    }
    for (let i = 0; i < _p.boardSize; i++) {
      cols.push(String.fromCharCode(i + 65))
    }

    return (
      <span className="board">
        <span>{playerLabel}</span>
        <Row
          rowLength={_p.boardSize}
          cols={cols}
          row="header"
        />
        {
          rows.map((row) =>
            <Row
              rowLength={_p.boardSize}
              boardStyle={_p.boardStyle}
              key={row}
              row={row + 1}
              cols={cols}
              ships={ships}
              shots={shots}
              potentialShots={this.props.potentialShots}
              handleInput={this.handleInput}
              handleClick={this.handleClick}
              playerName={playerLabel}
            />
          )
        }
        <Row
          rowLength={_p.boardSize}
          cols={cols}
          row="header"
        />
      </span>
    )
  }
}
