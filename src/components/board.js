import React, { Component } from 'react';
import Row from './row';
import isValidShipPlacement from '../modules/ships.js';

const objectWithoutKey = (object, key) => {
  const { [key]: deletedKey, ...otherKeys } = object;
  let newObject = []
  for (let person in otherKeys) {
    newObject.push(...otherKeys[person])
  }
  return newObject;
};

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,  // { size, style, owner }
      data: this.props.data,  // 2d array of board size containing { ship, shot, color }
      gameInfo: this.props.gameInfo,  // { turn }
    }

    this.handleRowInput = this.handleRowInput.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowInput(r, c, ship) {
    if (this.state.config.style === 'input' && !isValidShipPlacement(r, c, ship, this.state.data, this.state.config)) {
      return;
    }
    let newData = [...this.state.data];
    let newRow = [...newData[r]];
    let location = { ...newData[r][c] };
    location.ship = ship;
    newRow[c] = location;
    newData[r] = newRow;
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
      colors = ['white', 'blue', 'red', 'grey', 'black'];
      const nextColor = 
        indexOf(location.color) === colors.length - 1 ?
        0 :
        indexOf(location.color + 1);
      location.color = colors[nextColor];
    }
    
    newRow[c] = location;
    newData[r] = newRow;
    this.setState({ data: newData });
  }

  render(i) {
    const config = this.state.config;
    const data = this.state.data;
    return (
      <span className='board'>
        <span>{ config.owner }</span>
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
