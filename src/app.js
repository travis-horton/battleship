import React, { Component } from "react";
import ReactDOM from "react-dom";
import { submitConfig } from "./modules/config.js";
import { joinGame } from "./modules/connect.js";
import { inputShot, shoot } from "./modules/shooting.js";
import { inputShip, whatShipIsHere, allShipsArePlaced, allPlayersShipsPlaced } from "./modules/ships.js"
import Setup from "./components/setup.js";
import BoardArea from "./components/boardArea";
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
    this.handleClick = this.handleClick.bind(this);
    this.handleShoot = this.handleShoot.bind(this);

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
    let self = this;

    let gameId = prompt("Enter game id: ");
    if (gameId === null || gameId.length === 0) return;

    // This joins the game if the gameId exists in the database.
    // SIDE EFFECTS: sets state to database data and adds player if player is new.
    joinGame(gameId, database, self);
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
      database.ref(`${this.state.gameId}/${this.state.playerName + "Ships"}`).set(this.state.ships);
      database.ref(`${this.state.gameId}/shots/${this.state.playerName}`).set([0]);
      database.ref(`${this.state.gameId}/turn`).set(0);
    }
  }

  handleClick(c, r) {
    let self = this;

    // On click on a cell in the board:
    // updates shots chosen and highlights cell.
    // SIDE EFFECTS: Sets db state.
    inputShot(c, r, database, self);
  }

  handleShoot() {
    let self = this;
    shoot(self, database);
  }

  render() {
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
            shots={this.state.shots}
            handleSubmit={this.handleBoardSubmit}
          />
        </div>
      )

    } 

    let allOtherPlayers = [];
    for (let key in this.state.players) {
      if (this.state.playerName !== key) allOtherPlayers.push(key);
    }

    return (
      <div>
        <Instructions 
          shipsCommitted={true}
          curPlayers={allOtherPlayers}
          thisPlayer={thisPlayer.name}
          maxPlayers={this.state.numPlayers}
          turn={this.state.turn}
        />
        <BoardArea
          handleInput={this.handleBoardInput}
          handleSubmit={this.handleBoardSubmit}
          handleClick={this.handleClick}
          handleShoot={this.handleShoot}
          boardSize={this.state.boardSize}
          thisPlayer={thisPlayer}
          ships={this.state.ships}
          shots={this.state.shots}
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
