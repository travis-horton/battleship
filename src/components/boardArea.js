import React, { Component } from "react";
import { Board } from "./board";

export default class BoardArea extends React.Component {
  constructor(props) {
    super(props);
    this.handleBoardInput = this.handleBoardInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleShoot = this.handleShoot.bind(this);
  }

  handleBoardInput(c, r, val) {
    this.props.handleInput(c, r, val);
  }

  handleSubmit(e) {
    this.props.handleSubmit(e);
  }

  handleClick(c, r) {
    this.props.handleClick(c, r);
  }

  handleShoot(e) {
    e.preventDefault();
    this.props.handleShoot();
  }

  render() {
    const _p = this.props;
    if (!_p.thisPlayer.shipsCommitted) {
      return (
        <div className="right_column">
          <Board
            boardSize={_p.boardSize}
            boardStyle="input"
            handleBoardInput={this.handleBoardInput}
            boardOwner={_p.thisPlayer.name}
            ships={_p.ships}
            thisPlayer={_p.thisPlayer.name}
            handleBoardShoot={() => {}}
          />
          <br/>
          <button onClick={this.handleSubmit}>Submit ship placement</button>
        </div>
      )
    } else {
      let players = _p.players;

      const getBoardShots = (shots, boardOwner) => {
        let thisBoardShots = [];
        for (let p in shots) {
          if (p !== boardOwner && shots[p]) {
            shots[p].forEach((turn) => {
              thisBoardShots.push(...turn);
            })
          }
        }
        return thisBoardShots;
      }

      return (
        <div>
          <div className="board_area">
            <Board
              boardSize={_p.boardSize}
              boardOwner={"shooting"}
              potentialShots={_p.potentialShots}
              thisPlayer={_p.thisPlayer.name}
              handleBoardShoot={this.handleClick}
            />
            <Board
              boardSize={_p.boardSize}
              boardOwner={_p.thisPlayer.name}
              ships={_p.ships}
              shots={getBoardShots(_p.shots, _p.thisPlayer.name)}
              potentialShots={_p.potentialShots}
              thisPlayer={_p.thisPlayer.name}
              handleBoardShoot={() => {}}
            />
          </div>
          <div>
            <button onClick={this.handleShoot}>Fire ze missiles!</button>
          </div>
          <div className="board_area">
            {
              players.map((boardOwner) =>
                <Board
                  key={boardOwner}
                  boardSize={_p.boardSize}
                  boardOwner={boardOwner}
                  shots={getBoardShots(_p.shots, boardOwner)}
                  potentialShots={_p.potentialShots}
                  thisPlayer={_p.thisPlayer.name}
                  handleBoardShoot={() => {}}
                />
              )
            }
          </div>
        </div>
      )
    }
  }
}
