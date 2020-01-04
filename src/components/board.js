import React, { Component } from 'react';
import Row from './row';

const getLabel = (owner, style) => {
  if (style === 'input') return 'Input your ships here:';
  if (style === 'shooting') return 'This is your shooting board:';
  if (style === 'ships') return 'These are your ships:';
  if (style === 'destination') return `This is ${owner}'s board:`;
}

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.handleRowInput = this.handleRowInput.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRowRightClick = this.handleRowRightClick.bind(this);
  }

  handleRowInput(r, c, ship) {
    let owner = this.props.config.owner;
    this.props.shipFunctions("placeShip", { r, c, ship, owner });
  }

  handleRowClick(r, c) {
    this.props.shootingFunctions("shoot", [r, c]);
  }

  handleRowRightClick(r, c) {
    const colors = ['', 'blue', 'red', 'grey', 'black', 'green'];
    let newData = [...this.props.data];
    let nextColor = colors.indexOf(newData[r][c].color) + 1;
    if (colors.indexOf(newData[r][c].color) === colors.length - 1) nextColor = 0;
    newData[r][c].color = colors[nextColor];

    this.setState({ data: newData });
  }


  render(i) {
    const config = this.props.config;
    const data = this.props.data;
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
                turn={ this.props.turn }
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
