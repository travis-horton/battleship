import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Setup from './components/setup.js';
import submitConfig from './modules/config.js';
import joinGame from './modules/connect.js';
import Instructions from './components/instructions';
import Board from './components/board.js';
import { 
  generateNewShots, 
  numberOfShotsYouGet,
  getHits,
} from './modules/shooting.js';
import { allPlayersShipsPlaced } from './modules/ships.js'

let database = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        boardSize: 0,
        gameId: '',
        maxPlayers: 0,
        maxShips: {
          a: 5,
          b: 4,
          c: 3,
          s: 3,
          d: 2,
        },
      },

      localInfo: {
        name: '',
        // one of: [initial, setup, gameOn, gameEnd]
        status: 'initial',
        boardInfo: [
          // one for shooting, one for this players ships, one each for every other player
          // Example:
          //{
          //  data: 2d array of boardSize, each element { ship: str, shot: int, color: str },
          //  config: {
          //   size: int,
          //   style: str,
          //   owner: str,
          //   maxShips: {
          //     a: 5, b: 4, etc...
          //   }
          //
        ],
        ships: {
          a: [],
          b: [],
          c: [],
          s: [],
          d: [],
        },
        shots: [],
      },

      gameState: {
        turn: 0,
        turnOrder: [0],
        players: {
          '': {
            connected: true,
            turn: false,
            shipsCommitted: false,
            lost: false,
            hits: {
              a: 0,
              b: 0,
              c: 0,
              s: 0,
              d: 0,
            },
          },
        },
      },
    };

    this.configure = this.configure.bind(this);
    this.ships = this.ships.bind(this);
    this.shootingFunctions = this.shootingFunctions.bind(this);

    /*
      makeShot: this.shootingFunctions.makeShote.bind(this),
      commitShots: this.shootingFunctions.commitShots.bind(this),
    */
  }

  configure(e, config) {
    switch (e.target.id) {
      case 'make_new_game': {
        this.setState(prevState => ({ localInfo: { ...prevState.localInfo, status: 'setup' } }));
        break;
      }

      case 'config_submit': {
        // First, checks config for errors.
        // Then sets db state to those config params.
        // Then fires joinGame.
        submitConfig(config, database, this);
        break;
      }

      case 'join_game': {
        joinGame(database, this);
        break;
      }
    }
  }

  ships(id, data) {
    if (id === 'input') {
      const { config, localInfo, gameState } = this.state;
      const { name, status, boardInfo } = localInfo
      this.setState({ config, localInfo: { name, status, boardInfo, ships: data }, gameState });
    }

    if (id === 'commit') {
      const { config, localInfo } = this.state;
      database.ref(`${ config.gameId }/gameState/players/${ localInfo.name }/shipsCommitted`).set(true);
      database.ref(`${ config.gameId }/ships/${ localInfo.name }`).set(localInfo.ships);
    }
  }

  shootingFunctions(id, data) {
    console.log(id);
    console.log(data);
    console.log("shoot mf");
  }

  render() {
    const { config, localInfo, gameState, } = this.state;
    let curPlayers = [];
    for (let player in gameState.players) {
      curPlayers.push(player);
    }
    switch (localInfo.status) {
      case 'initial': {
        return (
          <div>
            <button id='make_new_game' onClick={ this.configure }>New game</button>
            <button id='join_game' onClick={ this.configure }>Join game</button>
          </div>
        );
      }

      case 'setup': {
        return (
          <Setup id='config_submit' submitConfig={ this.configure }/>
        );
      }

      case 'gameOn': {
        const boards = localInfo.boardInfo;
        return (
          <div className='flex_box'>
            <Instructions 
              shipsCommitted={ gameState.players[localInfo.name].shipsCommitted }
              allShipsPlaced={ localInfo.ships.a ? true : false }
              curPlayers={ curPlayers }
              name={ localInfo.name }
              maxPlayers={ config.maxPlayers }
              turn={ gameState.turn }
              whosTurn={ Object.keys(gameState.players).filter(player => gameState.players[player].thisPlayerTurn=== true) }
              shots={ gameState.shots }
              hits={ gameState.hits }
              turnOrder={ gameState.turnOrder }
              commitShips={ this.ships }
            />
            <span>
              {
                boards.filter(board => board.config.style === "destination").map(board =>
                  <Board
                    key={ board.config.owner }
                    config={ board.config }
                    data={ board.data }
                    allShipsPlaced={ this.ships }
                    shootingFunctions={ this.shootingFunctions }
                  />
                )
              }
            </span>
            <span>
              {
                boards.filter(board => board.config.style !== "destination").map(board =>
                  <Board
                    key={ board.config.style }
                    config={ board.config }
                    data={ board.data }
                    allShipsPlaced={ this.ships }
                    shootingFunctions={ this.shootingFunctions }
                  />
                )
              }
            </span>
          </div>
        );
      }

    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
