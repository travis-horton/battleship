import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Board } from "./components/board.js";
import submitConfig from "./modules/config.js";
import joinGame from "./modules/connect.js";
import { 
  generateNewShots, 
  numberOfShotsYouGet,
  getHits,
} from "./modules/shooting.js";
import { 
  validateShip, 
  allShipsArePlaced, 
  allPlayersShipsPlaced, 
} from "./modules/ships.js"
import Setup from "./components/setup.js";
import BoardArea from "./components/boardArea";
import { Instructions } from "./components/instructions";

let database = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        boardSize: 0,
        gameId: "",
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
        name: "",
        // one of: [initial, setup, gameOn, gameEnd]
        status: "initial",
        boards: [
          // one for shooting, one for this players ships, one each for every other player
        ],
        ships: {
          a: [],
          b: [],
          c: [],
          s: [],
          d: [],
        },
      },

      gameState: {
        turn: 0,
        turnOrder: [0],
        players: {
          "": {
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
    // this.shootingFunctions = this.shootingFunctions.bind(this);

    /*
        inputShips: this.shipFunctions.inputShips.bind(this),
        commitShips: this.shipFunctions.commitShips.bind(this),
        makeShot: this.shootingFunctions.makeShote.bind(this),
        commitShots: this.shootingFunctions.commitShots.bind(this),
        */
  }

  configure(e, config) {
    switch (e.target.id) {
      case "make_new_game": {
        this.setState(prevState => ({ localInfo: { ...prevState.localInfo, status: "setup" } }));
        break;
      }

      case "config_submit": {
        // First, checks config for errors.
        // Then sets db state to those config params.
        // Then fires joinGame.
        submitConfig(config, database, this);
        break;
      }

      case "join_game": {
        joinGame(database, this);
        break;
      }
    }
  }

  ships(id, data) {
    console.log(id);
    console.log(data);
    console.log("doing some shit with ships");
  }

  render() {
    const { config, localInfo, gameState, } = this.state;
    switch (localInfo.status) {
      case "initial": {
        return (
          <div>
            <button id="make_new_game" onClick={ this.configure }>New game</button>
            <button id="join_game" onClick={ this.configure }>Join game</button>
          </div>
        );
      }

      case "setup": {
        return (
          <Setup id="config_submit" submitConfig={ this.configure }/>
        );
      }

      case "gameOn": {
        return (
          <div className="flex_box">
            <Instructions shipsCommitted={ false }/>
            { localInfo.boards.map(board => board.render() )}
          </div>
        );
      }

      case "shooting": {
        return (<div>shoot mf!</div>);
      }
    }
  }
}

class App2 extends Component {
  inputShip(c, r, val) {
    // Checks each entry of ship for valid placement and
    // sets state to reflect valid placement.
    // SIDE EFFECTS: Sets local ship state.
    validateShip(c, r, val, this);
  }

  commitShips(e) {
    if (!allShipsArePlaced(this.state.ships)) {
      alert("You have more ships to place!");

    } else if (confirm("Are you happy with your ship placement?")) {
      database.ref(`${this.state.gameId}/players/${this.state.playerName}/shipsCommitted`).set(true);
      database.ref(`${this.state.gameId}/ships/${this.state.playerName}`).set(this.state.ships);
      database.ref(`${this.state.gameId}/turn`).set(0);
    }
  }

  makeShot(c, r) {
    const potentialShots = this.state.potentialShots ? this.state.potentialShots : [];
    const numShots = numberOfShotsYouGet(this.state.ships, this.state.hits, this.state.playerName);

    this.setState({
      potentialShots: generateNewShots(c, r, potentialShots, numShots),
    });
  }

  commitShots() {
    const { gameId, shots, playerName, potentialShots, players, numPlayers, turnOrder, turn } = this.state;
    const isThisPlayersTurn = players[playerName].thisPlayerTurn;
    const numShots = numberOfShotsYouGet(this.state.ships, this.state.hits, this.state.playerName);

    if (!allPlayersShipsPlaced(players, numPlayers)) {
      alert("Waiting on other players to join/place ships");
      return;
    }

    if (!isThisPlayersTurn) {
      alert("It's not your turn!");
      return;
    }

    if (numShots > potentialShots.length) {
      alert(`You get ${numShots} shots and you've only shot ${potentialShots.length} times.`);
      return;
    }

    // set shots on db to potentials shots, reset local potential shots, and change turn
    database.ref(`${gameId}/players/${playerName}/thisPlayerTurn`).set(false);
    // determine next player and set their thisPlayerTurn to true. if last player, increase turn number
    let nextPlayer = turnOrder[turnOrder.indexOf(playerName) + 1];
    if (turnOrder.indexOf(playerName) + 1 == turnOrder.length) {
      nextPlayer = turnOrder[0];
      database.ref(`${gameId}/turn`).set(turn + 1);
    }
    database.ref(`${gameId}/players/${nextPlayer}/thisPlayerTurn`).set(true);

    database.ref(`${gameId}/ships`).once('value', (snapshot) => {
      let hits = getHits(potentialShots, snapshot.val(), playerName);
      database.ref(`${gameId}/shots/${playerName}/${turn}`).set(potentialShots);;
      database.ref(`${gameId}/hits/${playerName}/${turn}`).set(hits);
    });

    this.setState({
      potentialShots: [],
    });
  }

  render() {
    if (numberOfShotsYouGet(this.state.ships, this.state.hits, this.state.playerName) === 0) {
      database.ref(`${this.state.gameId}/players/${this.state.playerName}/lost`).set(true);
      return (<p>You lost.</p>);
    }

    for (let player in this.state.players) {
      if (this.state.players[player].lost) {
        return (<p>{player} lost!</p>);
      }
    }

    if (this.state.numPlayers === 0) {
      return (
        <div>
          <button id="new_game" onClick={this.config}>New game</button>
          <button onClick={this.handleJoinGame}>Join game</button>
        </div>
      )

    } 

    if (this.state.numPlayers === 1) {
      return (
        <Setup configSubmit={this.configSubmit}/>
      )
    } 

    let thisPlayer = this.state.players[this.state.playerName];
    thisPlayer.name = this.state.playerName;

    if (!thisPlayer.shipsCommitted) {
      return (
        <div className="flex_box">
          <Instructions shipsCommitted={false}/>
          <BoardArea
            inputShip={this.inputShip}
            boardSize={this.state.boardSize}
            thisPlayer={thisPlayer}
            ships={this.state.ships}
            commitShips={this.commitShips}
          />
        </div>
      )
    } 

    let allOtherPlayers = [];
    let whosTurn;
    for (let key in this.state.players) {
      if (this.state.playerName !== key) allOtherPlayers.push(key);
      if (this.state.players[key].thisPlayerTurn) whosTurn = key;
    }

    return (
      <div className="flex_box">
        <Instructions 
          shipsCommitted={true}
          curPlayers={allOtherPlayers}
          thisPlayer={thisPlayer.name}
          maxPlayers={this.state.numPlayers}
          turn={this.state.turn}
          whosTurn={whosTurn}
          shots={this.state.shots}
          hits={this.state.hits}
          turnOrder={this.state.turnOrder}
        />
        <BoardArea
          inputShip={this.inputShip}
          commitShips={this.commitShips}
          handleClick={this.makeShot}
          handleShoot={this.commitShots}
          boardSize={this.state.boardSize}
          thisPlayer={thisPlayer}
          ships={this.state.ships}
          shots={this.state.shots}
          potentialShots={this.state.potentialShots}
          players={allOtherPlayers}
        />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
