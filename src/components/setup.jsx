import React, { Component } from 'react';
import ConfigSelector from './configSelector';

export default class Setup extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      playerName: '',
      gameId: '',
      boardSize: 0,
      maxPlayers: 0,
      playerColor: '',
    };
  }

  handleChange(e, id) {
    if (!id) {
      this.setState({ playerColor: e.target.value });
    }
    this.setState({ [id]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { submitConfig } = this.props;
    const {
      playerName, playerColor, gameId, boardSize, maxPlayers,
    } = this.state;
    submitConfig(
      e,
      {
        playerColor,
        playerName: playerName.trim(),
        gameId: gameId.trim(),
        boardSize: Number(boardSize),
        maxPlayers: Number(maxPlayers),
      },
    );
  }

  render() {
    const { submitConfig } = this.props;
    const {
      playerName, gameId, boardSize, maxPlayers,
    } = this.state;
    return (
      <div>
        <p>
          Limit player name and game ID length to 20 characters, which must be letters or numbers!
        </p>
        <form id="config_submit" onSubmit={submitConfig}>
          <ConfigSelector
            id="playerName"
            type="text"
            labelText="Choose a player name: "
            onChange={this.handleChange}
          />
          <label htmlFor="playerColor">
            Player color
          </label>
          <select id="playerColor" onChange={this.handleChange}>
            <option value="">Please choose a color</option>
            <option className="green" value="green">green</option>
            <option className="purple" value="purple">purple</option>
            <option className="yellow" value="yellow">yellow</option>
            <option className="brown" value="brown">brown</option>
          </select>
          <ConfigSelector
            id="gameId"
            type="text"
            labelText="Choose a game id: "
            value={gameId}
            onChange={this.handleChange}
          />
          <ConfigSelector
            id="boardSize"
            type="number"
            labelText="Choose your board size (10-20): "
            min={10}
            max={20}
            value={boardSize}
            onChange={this.handleChange}
          />
          <ConfigSelector
            id="maxPlayers"
            type="number"
            labelText="Choose the number of players (2-4): "
            min={2}
            max={4}
            value={maxPlayers}
            onChange={this.handleChange}
          />
          <button id="config_submit" type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}
