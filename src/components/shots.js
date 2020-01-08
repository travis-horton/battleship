import React, { Component } from 'react';

const getPlayersShotsString = (shots) => {
  if (shots[0] === 0) return 'Not shot yet';
  let turnString = '';
  for (let shot = 0; shot < shots.length; shot++) {
    if (shots[shot] === 0) continue;
    turnString += String.fromCharCode(shots[shot][1] + 65);
    turnString += shots[shot][0] + 1;
    turnString += (shot < shots.length - 1) ? ', ' : '';
  }
  return turnString;
}

const turnNumber = (turn, shotsByTurn) => {
}

export default function Shots ({ shots, players, turnOrder }) {
  const playersArray = Object.keys(players);
  return (
    <div>
      { shots.map((turn, i) => 
      <table key={ i }>
        <thead>
        <tr>
          <th>Turn</th>
          <th>Player</th>
          <th>Shots</th>
          { playersArray.map(player => 
          <th key={ player }>Hit { player }</th>
          )}
        </tr>
        </thead>

        <tbody>
          { turnOrder.map((player, j) => {
            const turnNumber = shots.indexOf(turn);
            return (
              <tr key={ j }>
                <td>{ turnNumber + 1 }</td>
                <td>{ player }:</td>
                <td>{ getPlayersShotsString(turn[player])}</td>
                { playersArray.map(hitPlayer => {
                  let thisHits = [];

                  if (turn[player][0] === 0) {
                    thisHits = ['-'];
                  } else {
                    for (let ship in players[hitPlayer].hitsOnThisPlayer) {
                      if (hitPlayer === player) {
                        thisHits = ['n/a']
                      } else {
                        players[hitPlayer].hitsOnThisPlayer[ship].map(hit => {
                          if (hit.turn === turnNumber && hit.shooter === player) thisHits.push(ship);
                        });
                      }
                    };
                    if (thisHits.length === 0) {
                      thisHits.push('No hits');
                    }
                  }

                  return <td key={ hitPlayer }>{ thisHits.join(', ') }</td>
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
