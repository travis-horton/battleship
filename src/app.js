import React, { Component } from "react";
import ReactDOM from "react-dom";
import { submitConfig } from "./modules/config.js";
import { joinGame } from "./modules/connect.js";
import { isShotAt, numberOfShotsYouGet, indexOfShot } from "./modules/shooting.js";
import { allPlayersShipsPlaced, isShip, thisShipCanGoHere, newShipsWithoutThisLoc, allShipsArePlaced} from "./modules/ships.js"
import Setup from "./components/setup.js";
import BoardArea from "./components/boardArea";
import Instructions from "./components/instructions";

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
    if (val.length === 0) {
      let newShips = newShipsWithoutThisLoc(c, r, this.state.ships);
      this.setState({
        ships: newShips
      })
      return;
    }

    if (!isShip(val)) {
      alert(`"${val}" is not a ship letter (a, b, c, s, or d).`);
      return false;
    }

    if (thisShipCanGoHere(val, c, r, this.state.ships[val])) {
      let newShips = this.state.ships;
      if (newShips[val].locs[0] === 0) {
        newShips[val].locs[0] = [c, r];

      } else {
        newShips[val].locs.push([c, r]);
      }

      this.setState({
        ships: newShips
      });
    }
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
    let thisPlayersShots = [...this.state.shots[this.state.playerName]];
    let thisTurn = this.state.turn;

    if (isShotAt(c, r, thisPlayersShots)) {
      thisPlayersShots[thisTurn].splice(indexOfShot(c, r, thisPlayersShots[thisTurn]), 1);

    } else if (thisPlayersShots[thisTurn] === 0) {
      thisPlayersShots[thisTurn] = [[c, r]]

    } else if (thisPlayersShots[thisTurn].length >= numberOfShotsYouGet(this.state.ships)) {
      alert(`You only get ${numberOfShotsYouGet(this.state.ships)} shots.`);

    } else {
      thisPlayersShots[this.state.turn].push([c, r]);
    }

    this.setState({
      shots: {
        [this.state.playerName]: thisPlayersShots
      }
    });

    database.ref(`${this.state.gameId}/shots/${this.state.playerName}/${thisTurn}`).set(
      // keep the database from deleting entry if empty array
      thisPlayersShots[thisTurn].length > 0 ? 
      this.state.shots[this.state.playerName][thisTurn] :
      [0]
    );
  }

  handleShoot() {
    let playerName = this.state.playerName;
    let shots = this.state.shots[playerName];
    let turn = this.state.turn;
    let numOfShots = numberOfShotsYouGet(this.state.ships);

    if (shots[turn].length < numOfShots || !shots[turn]) {
      let howManyShots = shots[turn].length;
      if (!howManyShots) howManyShots = 0;
      alert(`You get ${numOfShots} shots!\nYou've only shot ${howManyShots} ${howManyShots === 1 ? "time" : "times"}.`);
      return;
    }

    if (!allPlayersShipsPlaced(this.state.players, this.state.numPlayers)) {
      alert("Waiting on other players to join/add ships.");
      return;
    }

    if (!playerName.turn) {
      // should probably say whose turn it is
      alert("It's not your turn!");
      return;
    }

    if (!confirm("Are you happy with your shots?")) {
      return;
    }

    //do some stuff with firebase to update shots and boards...
    console.log("fire ze missiles!");

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
        <Instructions />
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
