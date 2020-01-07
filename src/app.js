import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Setup from './components/setup.js';
import submitConfig from './modules/config.js';
import joinGame from './modules/connect.js';
import Instructions from './components/instructions';
import Board from './components/board.js';
import { shotsThisPlayerGets, generateNewStateWithShot, getNewGameStateAfterShooting, getHits } from './modules/shooting.js';
import { 
  allThisPlayersShipsArePlaced,
  allPlayersShipsPlaced, 
  isValidShipPlacement, 
  removeAllOfThisShipFromData, 
  getShipsLocs 
} from './modules/ships.js'

let database = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {  // boardSize, gameId, maxPlayers, maxShips
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

      localInfo: {  // name, status, boardInfo, ships, shots
        name: '',
        status: 'initial',  // one of: [initial, setup, gameOn, gameEnd]
        boardInfo: [
          // one each for every other player, one for this players ships,
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
        potentialShots: [],
      },

      gameState: {  // turnNumber, turnOrder, players
        turnNumber: 0,
        turnOrder: [0],
        shots: [],
        players: {  // for each player: connected, thisPlayerTurn, shipsAreCommitted, lost, hitsOnThisPlayer
          '': {
            connected: true,
            thisPlayerTurn: false,
            shipsAreCommitted: false,
            playerColor: '',
            lost: false,
            hitsOnThisPlayer: {
              a: [false],
              b: [false],
              c: [false],
              s: [false],
              d: [false],
            },
          },
        },
      },
    };

    this.handleNewState = this.handleNewState.bind(this);
    this.configure = this.configure.bind(this);
    this.ships = this.ships.bind(this);
    this.shootingFunctions = this.shootingFunctions.bind(this);
  }

  handleNewState(newState) {
    this.setState(newState);
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
        joinGame(database, this, this.handleNewState);
        break;
      }
        
    }
  }

  ships(id, data) {
    const { config, localInfo, gameState } = this.state;
    
    if (id === 'placeShip') {
      // you get r, c, ship, owner
      const { r, c, ship, owner } = data;
      const boards = this.state.localInfo.boardInfo;
      let thisBoard = boards.filter(board => board.config.owner === owner)[0];
      const thisBoardIndex = boards.indexOf(thisBoard);
      let newData = thisBoard.data;

      if (!isValidShipPlacement(r, c, ship, newData, thisBoard.config)) {
        return;
      }

      if (ship === '') {
        newData = removeAllOfThisShipFromData(newData[r][c].ship, newData);
      } else {
        newData[r][c].ship = ship;
      }

      thisBoard.data = newData;
      let newBoardInfo = boards;
      newBoardInfo[thisBoardIndex] = thisBoard;

      this.setState({ ...this.state, localInfo: { ...this.state.localInfo, boardInfo: newBoardInfo }});
      let shipsLocs = getShipsLocs(newData);

      if (
        allThisPlayersShipsArePlaced(shipsLocs, config.maxShips)
      ) {
        this.ships('allShipsArePlaced', shipsLocs);
      }
    }

    if (id === 'allShipsArePlaced') {
      const { name, status, boardInfo } = localInfo
      this.setState({ config, localInfo: { name, status, boardInfo, ships: data }, gameState });
    }

    if (id === 'commitShips') {
      const ships = localInfo.ships;
      if (!ships || !allThisPlayersShipsArePlaced(ships, config.maxShips)) {
        alert('You have more ships to place!');
        return;
      }

      if (!confirm('Are you happy with your ship placement?')) return;

      database.ref(`${ config.gameId }/gameState/players/${ localInfo.name }/shipsAreCommitted`).set(true);
      database.ref(`${ config.gameId }/ships/${ localInfo.name }`).set(localInfo.ships);
    }
  }

  shootingFunctions(id, data) {
    switch (id) {
      case 'shoot': {
        this.setState(generateNewStateWithShot(data, this.state, this));
        break;
      }

      case 'commitShots': {
        const { config, localInfo, gameState } = this.state;
        const curShotsThisPlayerGets = shotsThisPlayerGets(
          gameState.players[localInfo.name].hitsOnThisPlayer, config.maxShips
        );
        const numShotsTaken = localInfo.potentialShots.length;

        if (numShotsTaken < curShotsThisPlayerGets) {
          alert(`You get ${ curShotsThisPlayerGets } shot${ curShotsThisPlayerGets > 1 ? 's' : '' } and you've only shot ${ numShotsTaken } time${ numShotsTaken > 1 ? 's' : '' }!`);
          return;
        }
        if (!confirm('Are you happy with your shots?')) return;

        database.ref(config.gameId).once('value', (snapshot) => {
          const oldHits = {};
          for (let player in gameState.players) {
            oldHits[player] = gameState.players[player].hitsOnThisPlayer;
          }

          const newHits = getHits(
            localInfo.potentialShots, 
            snapshot.val().gameState.shots,
            snapshot.val().ships,
            oldHits,
            localInfo.name,
            gameState.turnNumber,
            config.maxShips
          );

          this.setState({ ...this.state, localInfo: { 
            ...this.state.localInfo, 
            potentialShots: [],
          } }, () => {
            database.ref(`${ config.gameId }/gameState/`).set(getNewGameStateAfterShooting(gameState, localInfo.potentialShots, localInfo.name, newHits));
          });
          
        });
      }
    }
  }

  render() {
    const { config, localInfo, gameState, } = this.state;

    switch (localInfo.status) {
      case 'initial': {
        return (
          <div className='flex_box'>
            <div className='intro'>
              <p>Traditional Battleship is a game played by two players, each with two 10x10 boards. Before the game starts, each player places several different ships on their respecitve boards. Then, each person takes turns shooting at the other player’s ships. The goal is to hit and “sink” the other player’s ships.</p>
              <p>After each round of shooting, the opponent announces if a ship was hit and if so, which ship it was. If all the sections of a ship are hit, that ship is sunk.</p>
              <p>When all the ships of a player are sunk, that player loses.</p>
              <p>This version of Battleship is slightly more advanced. The board size is left up to the player; the range is as small as 10x10 or as big as 20x20. Take note: For 2 player games, we recommend a 12x12  board or smaller. Any bigger than 13x13 will increase play time signficantly.</p>
              <p>Additionally, you can play with up to 4 players, for which we recommend boards between 16 and 20. In this version, each shot hits every board but the shooter's.</p>
              <p>If you’re joining a game, you will prompted to enter a case-sensitive game ID, so you will need to get that from the player who created the game.</p>
            <button id='make_new_game' onClick={ this.configure }>New game</button>
            <button id='join_game' onClick={ this.configure }>Join game</button>
            </div>
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
        const turnNumber = gameState.turnNumber;
        const nextShotTurn = (
          (gameState.shots[turnNumber] && gameState.shots[turnNumber][localInfo.name][0]) ? 
          gameState.turnNumber + 2:
          gameState.turnNumber + 1
        );
        const whosTurn = Object.keys(gameState.players).filter(player => gameState.players[player].thisPlayerTurn === true)[0]; 
        const playerColors = {};
        for (let player in gameState.players) {
          playerColors[player] = gameState.players[player].playerColor;
        }

        return (
          <div className='flex_box'>
            <Instructions 
              shipsAreCommitted={ gameState.players[localInfo.name].shipsAreCommitted }
              allShipsArePlaced={ localInfo.ships.a ? true : false }
              players={ gameState.players }
              name={ localInfo.name }
              maxPlayers={ config.maxPlayers }
              turnNumber={ gameState.turnNumber }
              whosTurn={ whosTurn }
              allShots={ gameState.shots }
              potentialShots={ localInfo.potentialShots }
              hitsOnThisPlayer={ gameState.players[localInfo.name].hitsOnThisPlayer }
              playerColors={ playerColors }
              shipMaxes={ config.maxShips }
              turnOrder={ gameState.turnOrder }
              commitShips={ this.ships }
              commitShots={ this.shootingFunctions }
            />
            <span>
              {
                boards.filter(board => board.config.style === 'destination').map(board =>
                  <Board
                    key={ board.config.owner }
                    config={ board.config }
                    data={ board.data }
                    turn={ nextShotTurn }
                    potentialShots={ this.state.localInfo.potentialShots }
                    playerColors={ playerColors }
                    allShipsArePlaced={ this.ships }
                    shootingFunctions={ this.shootingFunctions }
                    classNames={ whosTurn === localInfo.name ? 'snow' : '' }
                  />
                )
              }
              {
                boards.filter(board => board.config.style !== 'destination').map(board =>
                  <Board
                    key={ board.config.style }
                    config={ board.config }
                    data={ board.data }
                    potentialShots={ localInfo.potentialShots }
                    playerColors={ playerColors }
                    shipFunctions={ this.ships }
                    shootingFunctions={ this.shootingFunctions }
                  />
                )
              }
            </span>
          </div>
        );
      }

      case 'gameEnd': {
        return (<p>You lost.</p>);
      }
    }

  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
