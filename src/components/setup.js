import React, {Component} from 'react';
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
    };
  }

  handleChange(e, id) {
    this.setState({[id]: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitConfig(
      e,
      {
        playerName: this.state.playerName,
        gameId: this.state.gameId,
        boardSize: Number(this.state.boardSize),
        maxPlayers: Number(this.state.maxPlayers),
      },
    );
  }

  render() {
    return (
      <div>
        <p>Limit player name and game ID length to 20 characters, which must be letters or numbers!</p>
        <form id="config_submit" onSubmit={ this.props.submitConfig }>
          <ConfigSelector
            id="playerName"
            type="text"
            labelText="Choose a player name: "
            value={ this.state.playerName }
            onChange={ this.handleChange }
          />
          <ConfigSelector
            id="gameId"
            type="text"
            labelText="Choose a game id: "
            value={ this.state.gameId }
            onChange={ this.handleChange }
          />
          <ConfigSelector
            id="boardSize"
            type="number"
            labelText="Choose your board size (10-20): "
            min={ 10 }
            max={ 20 }
            value={ this.state.boardSize }
            onChange={ this.handleChange }
          />
          <ConfigSelector
            id="maxPlayers"
            type="number"
            labelText="Choose the number of players (2-4): "
            min={ 2 }
            max={ 4 }
            value={ this.state.maxPlayers }
            onChange={ this.handleChange }
          />
          <button id="config_submit" type="submit" onClick={ this.handleSubmit }>
            Submit
          </button>
        </form>
      </div>
    );
   }
 }
