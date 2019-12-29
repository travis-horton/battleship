import React, { Component } from 'react';
import { Row } from "./row";

const objectWithoutKey = (object, key) => {
  const {[key]: deletedKey, ...otherKeys } = object;
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
      config: this.props.config,  // { size, style, owner }
      data: this.props.data,  // 2d array of board size containing { ship, shot, color }
      key: this.props.config.owner,
    }

    this.handleRowInput = this.handleRowInput.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowInput() {
  }

  handleRowClick() {
  }

  render() {
    const config = this.state.config;
    const data = this.state.data;
    return (
      <span className="board" key="config.owner">
        <span>{ config.owner }</span>
        <Row
          row="header"
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
          row="header"
          length={ config.size }
        />
      </span>
    );
  }
};
