import React, { Component } from 'react';
import Row from './row';
import isValidShipPlacement from '../modules/ships.js';

const getLabel = (owner, style) => {
  if (style === 'input') return 'Input your ships here:';
  if (style === 'shooting') return 'This is your shooting board:';
  if (style === 'ships') return 'These are your ships:';
  if (style === 'destination') return `This is ${owner}'s board:`;
}

const getShipsLocs = (data) => {
  const shipsLocs = { a: [], b: [], c: [], s: [], d: [], };
  const size = data.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (data[i][j].ship) shipsLocs[data[i][j].ship].push([i, j]);
    }
  }
  return shipsLocs;
}

const allShipsArePlaced = (shipsPlaced, maxShips) => {
  for (let ship in shipsPlaced) {
    if (maxShips[ship] !== shipsPlaced[ship].length) return false;
  }
  return true;
}

const removeAllOfThisShipFromData = (ship, newData) => {
  const length = newData.length;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (newData[i][j].ship === ship) newData[i][j].ship = "";
    }
  }
  return newData;
}

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,  // { size, style, owner, maxShips }
      data: this.props.data,  // 2d array of board size containing { ship, shot, color }
      gameInfo: this.props.gameInfo,  // { turn }
    }

    if (this.props.config.style === "shooting") {
      length = this.props.data.length;
      for (let i = 0; i < length; i++) {
        for (let j = 0; j < length; j++) {
          this.state.data[i][j] = { shot: false };
        }
      }
    }

    this.handleRowInput = this.handleRowInput.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRowRightClick = this.handleRowRightClick.bind(this);
  }

  handleRowInput(r, c, ship) {
    if (this.state.config.style === 'input' && !isValidShipPlacement(r, c, ship, this.state.data, this.state.config)) {
      return;
    }

    let newData = [...this.state.data]
    
    if (ship === "") {
      newData = removeAllOfThisShipFromData(newData[r][c].ship, newData);
    } else {
      newData[r][c].ship = ship;
    }

    const shipsLocs = getShipsLocs(newData);

    if (allShipsArePlaced(shipsLocs, this.state.config.maxShips)) this.props.allShipsArePlaced('allShipsArePlaced', shipsLocs);
    this.setState({ data: newData });
  }

  handleRowClick(r, c) {
    this.props.shootingFunctions("shoot", [r, c]);
  }

  handleRowRightClick(r, c) {
    const colors = ['', 'blue', 'red', 'grey', 'black', 'green'];
    let newData = [...this.state.data];
    let nextColor = colors.indexOf(newData[r][c].color) + 1;
    if (colors.indexOf(newData[r][c].color) === colors.length - 1) nextColor = 0;
    newData[r][c].color = colors[nextColor];

    this.setState({ data: newData });
  }


  render(i) {
    const config = this.state.config;
    const data = this.state.data;
    return (
      <span className='board'>
        <span>{ getLabel(config.owner, config.style) }</span>
        <Row
          row='header'
          length={ config.size }
        />
        {
          data.map((row, i) => {
            return (
              <Row
                key={ i }
                row={ i }
                style={ config.style }
                data={ row }
                potentialShots={ this.props.potentialShots }
                length={ config.size }
                handleRowInput={ this.handleRowInput }
                handleRowClick={ this.handleRowClick }
                handleRowRightClick={ this.handleRowRightClick }
              />
            )}
          )
        }
        <Row
          row='header'
          length={ config.size }
        />
      </span>
    );
  }
};
