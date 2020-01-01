import React, { Component } from 'react';
import Row from './row';
import isValidShipPlacement from '../modules/ships.js';

const getLabel = (owner, style) => {
  if (style === 'input') return 'Input your ships here:';
  if (style === 'shooting') return 'This is your shooting board:';
  if (style === 'ships') return 'These are your ships:';
  if (style === 'destination') return `This is ${owner}'s board:`;
}

const makeNewData = (data, r, c, ship) => {
  data[r][c].ship = ship;
  return data;
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

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,  // { size, style, owner, maxShips }
      data: this.props.data,  // 2d array of board size containing { ship, shot, color }
      gameInfo: this.props.gameInfo,  // { turn }
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
    newData[r][c].ship = ship;
    const shipsLocs = getShipsLocs(newData);

    if (allShipsArePlaced(shipsLocs, this.state.config.maxShips)) this.props.allShipsPlaced('input', shipsLocs);
    this.setState({ data: newData });
  }

  handleRowClick(r, c) {
    // i think this all has to get passed up to app.js
    let newData = [...this.state.data];
    let newRow = [...newData[r]];
    let location = { ...newData[r][c] };

    if (this.state.config.style === 'shooting') {
      if (location.shot == true) {
        alert("You've already shot there!");
        return;
      }
      location.shot = turn;;
    } else {
      let colors = ['white', 'blue', 'red', 'grey', 'black'];
      const nextColor = 
        colors.indexOf(location.color) === colors.length - 1 ?
        0 :
        colors.indexOf(location.color + 1);
      location.color = colors[nextColor];
    }

    newRow[c] = location;
    newData[r] = newRow;
    this.setState({ data: newData });
  }

  handleRowRightClick(r, c) {
    let newData = [...this.state.data];
    let colors = ['', 'blue', 'red', 'grey', 'black', 'green'];
    const nextColor = 
      colors.indexOf(newData[r][c].color) === colors.length - 1 ?
      0 :
      colors.indexOf(newData[r][c].color) + 1;

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
