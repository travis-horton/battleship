import React, {Component} from 'react';
import Shots from './shots';
import { shotsThisPlayerGets } from '../modules/shooting.js';

const playersAreReady = (whosTurn) => {
  if (!whosTurn) return false;
  return true;
}

export default function Instructions({
  allShipsArePlaced,
  shipsAreCommitted,
  name,
  players,
  maxPlayers,
  turnNumber,
  whosTurn,
  allShots,
  potentialShots,
  shipMaxes,
  hitsOnThisPlayer,
  turnOrder,
  commitShips,
  commitShots,
}) {
  let curPlayers = [];
  for (let player in players) {
    if (players[player].connected) curPlayers.push(player);
  }

  if (!shipsAreCommitted) {
    const handleCommitShips = () => commitShips("commitShips");
    return (
      <div className='left_column'>
        <p><b>INSTRUCTIONS</b></p>
        <p>Now you will place your ships. You will place:</p>
        <p>5 "a"s--These a's will be your aircraft carrier.</p>
        <p>4 "b"s--These b's will be your battleship.</p>
        <p>3 "c"s--These c's will be your cruiser.</p>
        <p>3 "s"s--These s's will be your submarine.</p>
        <p>2 "d"s--These d's will be your destroyer.</p>
        <br/>
        <p>Each ship must be in a line horizontally, vertically, or diagonally.</p>
        <p>Ships are not allowed to cross one another.</p>
        <p>No ships may share a cell.</p>
        <br/>
        <p>When you've placed all your ships, click here:</p>
        <button className={ allShipsArePlaced ? "" : "not_ready" } onClick={ handleCommitShips }>Commit Ships</button>
      </div>
    );

  } else if (!playersAreReady(whosTurn)) {
    return (
      <div className='left_column'>
        <p>Welcome <b>{ name }</b>!</p>
        <p>Players connected: { curPlayers.length }/{ maxPlayers }. ({ curPlayers.join(', ') })</p>
        <p>Waiting on other players to connect and commit their ships.</p>
      </div>
    );

  }

  const handleCommitShots = () => {
    if (name !== whosTurn) {
      alert("It's not your turn!");
      return;
    }

    commitShots("commitShots");
  }

  const maxShots = shotsThisPlayerGets(hitsOnThisPlayer, shipMaxes);
  let buttonClass;
  if (name !== whosTurn || potentialShots.length !== maxShots) buttonClass = "not_ready";

  return (
    <div className='left_column'>
      <p>Welcome <b>{ name }</b>!</p>
      <p>Players connected: { curPlayers.length }/{ maxPlayers }. ({ curPlayers.join(', ') })</p>
      <p>Turn number: { turnNumber + 1 }</p>
      <p>It is { whosTurn === name ? 'your' : `${ whosTurn }'s`} turn.</p>
      <p>Shots taken: { potentialShots.length }/{ maxShots } shots total</p>
      <button className={ buttonClass } onClick={ handleCommitShots }>Fire ze missiles!</button>
      <Shots
        shots={ allShots }
        players={ players }
        turnOrder={ turnOrder }
      />
    </div>
  );

}

