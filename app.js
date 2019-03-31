import React, { Component } from "react";
import ReactDOM from "react-dom";
import { errorsInConfigInput, whatShipIsHere, isShip, thisShipCanGoHere, howManyShipsOfThisType, isAdjacent, isInLine, isAdjacentColumn, isAdjacentRow, getOrientation, newShipsWithoutThisLoc, allShipsArePlaced, choosePlayerName, isShotAt, numberOfShotsYouGet, indexOf } from "./modules/functions"
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
    while (!gameId) gameId = prompt("Enter game id: ");
    database.ref(gameId).once('value', function(snapshot) {
      if (!snapshot.exists()) {
        alert("No such game in database.");
        return;
      }

      let maxNumPlayers = snapshot.val().numPlayers;
      let curNumPlayers = Object.keys(snapshot.val().players).length

      let playerName = choosePlayerName();

      database.ref(`${gameId}/players`).once("value").then(function(players) {
        let areShipsCommitted = false;

        if (players.hasChild(playerName)) {
          if (!players.val()[playerName].connected) {
            database.ref(`${gameId}/players/${playerName}/connected`).set(true);
            database.ref(`${gameId}/players/${playerName}/connected`).onDisconnect().set(false);
            areShipsCommitted = players.val()[playerName].shipsCommitted;
          } else {
            alert("That player is already connected.")
            return;
          }
        } else if (curNumPlayers >= maxNumPlayers) {
          alert("Game is full.");
          return;
        }

        while (players.hasChild(playerName) && players.val()[playerName].connected) {
          playerName = choosePlayerName("That name is already taken.");
        }

        let thisPlayerInfo = {
          connected: true,
          thisPlayerTurn: false,
          shipsCommitted: areShipsCommitted
        };

        database.ref(`${gameId}/players/${playerName}`).set(thisPlayerInfo);
        database.ref(`${gameId}/players/${playerName}/connected`).onDisconnect().set(false);

        database.ref(gameId).on('value', function(snapshot) {
          let fBState = snapshot.val();

          let newState = {
            boardSize: fBState.boardSize,
            gameId: gameId,
            numPlayers: fBState.numPlayers,
            playerName: playerName,
            players: fBState.players,
            turn: fBState.turn
          }

          if (snapshot.val()[(playerName + "Ships")] !== undefined) {
            newState.ships = snapshot.val()[(playerName + "Ships")];
          }

          if (snapshot.val().shots !== undefined) {
            newState.shots = snapshot.val().shots;
          }

          self.setState(newState);
        });
      })
    })

  }

  handleConfigSubmit(config) {
    if (!errorsInConfigInput(config)) {
      let players = {};
      players[config.playerName] = {
        connected: true,
        thisPlayerTurn: false,
        shipsCommitted: false
      };

      let firebaseState = {
        boardSize: config.boardSize,
        gameId: config.gameId,
        numPlayers: config.numPlayers,
        players: {...players}
      }

      let self = this;
      database.ref("/").once("value").then(function (snapshot) {
        if (snapshot.hasChild(config.gameId)) {
          alert("Game ID already taken, choose a new game ID.");

        } else {
          database.ref(config.gameId).set(firebaseState);
          database.ref(config.gameId).on('value', function(snapshot) {
            let newState = snapshot.val();
            newState.playerName = config.playerName;
            console.log(newState);
            self.setState(newState);
          });
          database.ref(`${config.gameId}/players/${config.playerName}/connected`).onDisconnect().set(false);
        }
      })
    }
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
      })
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
      thisPlayersShots[thisTurn].splice(indexOf(c, r, thisPlayersShots[thisTurn]), 1);

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
    })
  }

  handleShoot() {
    let playerName = this.state.playerName;
    let shots = this.state.shots[playerName];
    let turn = this.state.turn;
    let numOfShots = numberOfShotsYouGet(this.state.ships);

    if (shots[turn].length < numOfShots || !shots[turn]) {
      let howManyShots = shots[turn].length;
      if (!howManyShots) howManyShots = 0;
      let time = "times";
      if (shots[turn].length === 1) time = "time";
      alert(`You get ${numOfShots} shots!\nYou've only shot ${howManyShots} ${time}.`)
      return;
    }

    if (!confirm("Are you happy with your shots?")) {
      return;
    }

    //do some stuff with firebase...

    console.log("fire ze missiles!");
  }

  render() {
    let shipsCommitted = this.state.players[this.state.playerName].shipsCommitted;
    if (this.state.numPlayers === 0) {
      return (
        <div>
        <button onClick={this.handleNewGame}>New game</button>
        <button onClick={this.handleJoinGame}>Join game</button>
        </div>
      )

    } else if (this.state.numPlayers === 1) {
      return (
        <Setup handleSubmit={this.handleConfigSubmit}/>
      )
    } else if (!shipsCommitted) {
      let thisPlayer = this.state.players[this.state.playerName];
      thisPlayer.name = this.state.playerName;
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

    } else {
      let thisPlayer = this.state.players[this.state.playerName];
      thisPlayer.name = this.state.playerName;
      let allPlayers = Object.keys(this.state.players);

      allPlayers.splice(allPlayers.indexOf(this.state.playerName), 1);

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
        players={allPlayers}
        />
        </div>
      )
    }
  }
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);
