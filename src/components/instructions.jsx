import React from 'react';
import Shots from './shots';
import { shotsThisPlayerGets } from '../modules/shooting';
import { allPlayersShipsPlaced } from '../modules/ships';

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
  playerColors,
  commitShips,
  commitShots,
}) {
  const curPlayers = [];
  const playerKeys = players.keys();
  const playersLength = playerKeys.length();
  for (let i = 0; i < playersLength; i += 1) {
    const player = players[playerKeys[i]];
    if (player.connected) curPlayers.push(player);
  }

  if (!shipsAreCommitted) {
    const handleCommitShips = () => commitShips('commitShips');
    return (
      <div className="left_column">
        <p><b>INSTRUCTIONS</b></p>
        <p>Now you will place your ships. You will place:</p>
        <p>5 &quot;a&quot;s--These a&apos;s will be your aircraft carrier.</p>
        <p>4 &quot;b&quot;s--These b&apos;s will be your battleship.</p>
        <p>3 &quot;c&quot;s--These c&apos;s will be your cruiser.</p>
        <p>3 &quot;s&quot;s--These s&apos;s will be your submarine.</p>
        <p>2 &quot;d&quot;s--These d&apos;s will be your destroyer.</p>
        <br />
        <p>Each ship must be in a line horizontally, vertically, or diagonally.</p>
        <p>Ships are not allowed to cross one another.</p>
        <p>No ships may share a cell.</p>
        <br />
        <p>When you&apos;ve placed all your ships, click here:</p>
        <button className={allShipsArePlaced ? '' : 'not_ready'} onClick={handleCommitShips}>Commit Ships</button>
      </div>
    );
  } if (!allPlayersShipsPlaced(players, maxPlayers)) {
    return (
      <div className="left_column">
        <p>
          Welcome
          <b>{ name }</b>
          !
        </p>
        <p>
          Players connected:
          { curPlayers.length }
          /
          { maxPlayers }
          . (
          { curPlayers.join(', ') }
          )
        </p>
        <p>Waiting on other players to connect and commit their ships.</p>
      </div>
    );
  }

  const handleCommitShots = () => {
    if (name !== whosTurn) {
      alert('It\'s not your turn!');
      return;
    }

    commitShots('commitShots');
  };

  const maxShots = shotsThisPlayerGets(hitsOnThisPlayer, shipMaxes);
  let buttonClass;
  if (name !== whosTurn || potentialShots.length !== maxShots) buttonClass = 'not_ready';
  const classNames = whosTurn === name ? 'snow' : '';

  return (
    <div className="left_column">
      <p>
        Welcome
        <b>{ name }</b>
        !
      </p>
      <p>You can input your shots on by clicking on any other player&apos;s board.</p>
      <p>
        You can also right click any other player&apos;s board&apos;s cells
        to cycle through some colors to keep track of your thoughts.
      </p>
      <p>
        Players connected:
        { curPlayers.length }
        /
        { maxPlayers }
        .
      </p>
      <div>
        <p>Player colors: </p>
        { curPlayers.map((player) => (
          <p className={playerColors[player]} key={player}>{ player }</p>
        )) }
      </div>
      <p>
        Turn number:
        { turnNumber + 1 }
      </p>
      <p className={classNames}>
        It is
        { whosTurn === name ? 'your' : `${whosTurn}'s`}
        {' '}
        turn.
      </p>
      <p>
        Shots taken:
        { potentialShots.length }
        /
        { maxShots }
        {' '}
        shots total
      </p>
      <button className={buttonClass} onClick={handleCommitShots}>Fire ze missiles!</button>
      <Shots
        shots={allShots}
        players={players}
        turnOrder={turnOrder}
      />
    </div>
  );
}
