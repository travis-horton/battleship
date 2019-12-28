import React, {Component} from 'react';
import { Row } from "./row";

const objectWithoutKey = (object, key) => {
  const {[key]: deletedKey, ...otherKeys} = object;
  let newObject = []
  for (let person in otherKeys) {
    newObject.push(...otherKeys[person])
  }
  return newObject;
}

export class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        size: this.props.size,
        style: this.props.style,
        owner: this.props.owner,
      },

      data: {
        ships: this.props.ships,
        shots: this.props.shots,
        colors: this.props.color,
      },
    }
  }

  render() {
    const config = this.state.config;
    console.log(`Size: ${config.size}, style: ${config.style}, owner: ${config.owner}`);
    console.log("Data:");
    console.log(this.state.data);
    return (<p>This is a board, bitches.</p>);
  }
};

export function board({
  boardSize,
  boardStyle,
  boardOwner,
  shots,
  ships,
  thisPlayer,
  potentialShots,
  handleBoardShipInput,
  handleBoardShoot,
}) {
  const handleRowShipInput = (c, r, val) => handleBoardShipInput(c, r, val);
  const handleRowShoot = (c, r) => handleBoardShoot(c, r);

  const rows = [...Array(boardSize).keys()];
  const cols = [...Array(boardSize).keys()].map(el => String.fromCharCode(el + 65)); //generates an array of letters from "A" board size in length
  
  let playerLabel = (
    boardOwner === "shooting" ?
    "your shooting board" :
    boardOwner + "'s board"
  )

  if (boardOwner === thisPlayer && boardStyle !== "input") {
    playerLabel = "your ships";
  }

  return (
    <span className="board">
      <span>{playerLabel}</span>
      <Row
        rowLength={boardSize}
        cols={cols}
        row="header"
      />
      {
        rows.map((row) =>
          <Row
            rowLength={boardSize}
            boardStyle={boardStyle}
            key={row}
            row={row + 1}
            cols={cols}
            ships={ships}
            shots={shots}
            potentialShots={potentialShots}
            handleRowShipInput={handleRowShipInput}
            handleRowShoot={handleRowShoot}
            playerName={playerLabel}
          />
        )
      }
      <Row
        rowLength={boardSize}
        cols={cols}
        row="header"
      />
    </span>
  )
}
