import React, { Component } from 'react';
import { getAllShotsByTurn } from '../modules/shooting.js';

const getPlayersShotsString = (shots) => {
  if (!shots) return '';
  let turnString = '';
  for (let shot = 0; shot < shots.length; shot++) {
    turnString += shots[shot].join('');
    turnString += (shot < shots.length - 1) ? ', ' : '';
  }
  return turnString;
}

const turnNumber = (turn, shotsByTurn) => {
}

export default function Shots ({ shots, hits, players, turnOrder }) {
  if (!hits) return (<p>Waiting on firebase</p>);
  let shotsByTurn = getAllShotsByTurn(shots);
  return (
    <div>
      { shotsByTurn.map((turn, i) => 
      <table key={ i }>
        <thead>
        <tr>
          <th>Turn</th>
          <th>Player</th>
          <th>Shots</th>
          { players.map((player) => 
          <th key={ player }>Hits on { player }</th>
          )}
        </tr>
        </thead>

        <tbody>
          { turnOrder.map((player, j) => {
            const turnNumber = shotsByTurn.indexOf(turn);
            return (
              <tr key={ j }>
                <td>{ turnNumber + 1 }</td>
                <td>{ player }:</td>
                <td>{ getPlayersShotsString(turn[player])}</td>
                { players.map(hitPlayer => {
                  let thisHits = '';
                  if (hits[player] && hits[player][turnNumber] && hits[player][turnNumber][hitPlayer]) {
                    thisHits = hits[player][turnNumber][hitPlayer].join(', ');
                  }
                  return <td key={ hitPlayer }>{ thisHits }</td>
                })}
              </tr>
            )
          }
          )}
        </tbody>
      </table>
      )}
    </div>
  )
}
