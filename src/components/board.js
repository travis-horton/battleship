import React, { Component } from 'react';
import Row from './row';

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
    }

    this.handleRowInput = this.handleRowInput.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowInput(r, c, ship) {
    console.log(`You put something in at ${r}-${c}.`);
    let newData = [...this.state.data];
    let newRow = [...newData[r]];
    let location = { ...newData[r][c] };
    location.ship = ship;
    newRow[c] = location;
    newData[r] = newRow;
    this.setState({ data: newData });
  }

  handleRowClick() {
    console.log('You clicked on something.');
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
