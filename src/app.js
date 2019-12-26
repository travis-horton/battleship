import React, { Component } from "react";
import ReactDOM from "react-dom";
import { submitConfig } from "./modules/config.js";
import { joinGame } from "./modules/connect.js";
import { 
  generateNewShots, 
  numberOfShotsYouGet,
  getHits,
} from "./modules/shooting.js";
import { 
  inputShip, 
  whatShipIsHere, 
  allShipsArePlaced, 
  allPlayersShipsPlaced, 
} from "./modules/ships.js"
import Setup from "./components/setup.js";
import { BoardArea } from "./components/boardArea";
import { Instructions } from "./components/instructions";

let database = firebase.database();

class App extends Component {
  constructor(props) {
    super(props);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.handleJoinGame = this.handleJoinGame.bind(this);
    this.handleConfigSubmit = this.handleConfigSubmit.bind(this);
    this.handleBoardInput = this.handleBoardInput.bind(this);
    this.handleBoardSubmit = this.handleBoardSubmit.bind(this);
    this.makeShot = this.makeShot.bind(this);
    this.commitShots = this.commitShots.bind(this);

    this.state = {
      boardSize: 0,
      gameId: "",
      // numPlayers also determines in part what renders
      numPlayers: 0,
      playerName: "",
      ships: {
        a: {locs: [0], max: 5},
        b: {locs: [0], max: 4},
        c: {locs: [0], max: 3},
        s: {locs: [0], max: 3},
        d: {locs: [0], max: 2}
      },
      shots: [],
      players: {
        "": {
          connected: true,
          thisPlayerTurn: false,
          shipsCommitted: false
        }
      },
      turn: 0
    }
  }

  handleNewGame() {
    this.setState({numPlayers: 1});
  }

  handleJoinGame() {
    let gameId = prompt("Enter game id: ");
    if (gameId === null || gameId.length === 0) return;

    // This joins the game if the gameId exists in the database.
    // SIDE EFFECTS: sets state to database data and adds player if player is new.
    joinGame(gameId, database, this);
  }

  handleConfigSubmit(config) {
    let self = this;
    
    // First, checks config for errors.
    // Then sets db state to those config params.
    // Lastly tells database to notify and update local state on changes.
    submitConfig(config, database, self);
  }

  handleBoardInput(c, r, val) {
    let self = this;

    // Checks each entry of ship for valid placement and
    // sets state to reflect valid placement.
    // SIDE EFFECTS: Sets local ship state.
    inputShip(c, r, val, self);
 }

  handleBoardSubmit(e) {
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
        <button onClick={this.handleNewGame}>New game</button>
        <button onClick={this.handleJoinGame}>Join game</button>
        </div>
      )

    } 

    if (this.state.numPlayers === 1) {
      return (
        <Setup handleSubmit={this.handleConfigSubmit}/>
      )
    } 

    let thisPlayer = this.state.players[this.state.playerName];
    thisPlayer.name = this.state.playerName;

    if (!thisPlayer.shipsCommitted) {
      return (
        <div className="flex_box">
          <Instructions shipsCommitted={false}/>
          <BoardArea
            handleInput={this.handleBoardInput}
            boardSize={this.state.boardSize}
            thisPlayer={thisPlayer}
            ships={this.state.ships}
            handleSubmit={this.handleBoardSubmit}
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
          handleInput={this.handleBoardInput}
          handleSubmit={this.handleBoardSubmit}
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
