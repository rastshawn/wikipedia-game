import './game.css';
import { React, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import socket from '../../websocketclient.js';
/*
logic:

if game is not started, show lobby screen:
  render lobby:
    fetch all current players, display
    listen for newPlayer event, add to players array

else, if game is going:

*/
const Game = function (/* props */) {
  const [playerName, setPlayerName] = useState('Player');
  const [loading, setLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [userIsInGame, setUserIsInGame] = useState(false);
  // const [gamePhase, setGamePhase] = useState('lobby');

  const params = useParams();


  ////////////////////////////////////////// HELPER FUNCTIONS
  const updateGame = () => {
    socket.socketRef.emit('getGame', params.id, (response) => {
      setCurrentGame(response);
      console.log(response);
    });
  };
  const isUserInGame = () => currentGame?.players.some((player) => {
    console.log(player.id);
    console.log(socket.socketRef.id);
    return player.id === socket.socketRef.id;
  });
  const renderPhase = () => {
    switch (currentGame?.phase) {
      case "writing":
        return <WritingPhase />;
      case "voting":
      case "scoring":
      case "endgame":
      case "lobby": 
        return (<LobbyPhase />);
      default: 
        return <div>That game doesn't seem to be working properly. Double check your link.</div>;
    }
  }

  ////////////////////////////////////////// LISTENERS
  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components
  useEffect(() => { // https://wattenberger.com/blog/react-hooks
    updateGame();

    socket.socketRef.on('newPlayer', (response) => {
      console.log(response);
      updateGame();
    });

    socket.socketRef.on('gameState', (response) => {
      setCurrentGame(response);
    });

    // see if player ID is in the game, if not display the 'join game' fields
    // then when player joins, show page

    // await functions can go here
    setLoading(false);
    return () => {
      // this gets called when the component is cleared
      // clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log(currentGame);
    setUserIsInGame(isUserInGame());
    return () => {
      // this gets called when the component is cleared
      // clearInterval(interval);
    };
  }, [currentGame]);

  const joinClick = () => {
    socket.socketRef.emit('joinGame', {
      name: playerName,
      gameId: params.id,
    }, (response) => {
      setCurrentGame(response);
    });
  };
  ////////////////////////////////////////// SUBCOMPONENTS 
  const LobbyPhase = () => {
    return (
      <div className="lobby">
        {
          (userIsInGame) ? '' : (
            <div className="join-form">
              <div className="form-group">
                <p>Nickname:</p>
                <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
              </div>
              <div className="form-group">
                <button onClick={joinClick}>Join Game</button>
              </div>
            </div>
          )
        }
        {console.log(userIsInGame)}
        <h1>{params.id}</h1>

        {/* game display */}
        <div className="playersInGame">
          <ul>
            {
              (() => {
                const rows = [];
                for (let i = 0; currentGame && i < currentGame.players.length; i++) {
                  const player = currentGame.players[i];
                  if (player.id === socket.socketRef.id) {
                    rows.push(<li>
                      {player.name}
                      {' '}
                      (you)
                              </li>);
                  } else {
                    rows.push(<li>{player.name}</li>);
                  }
                }
                return rows;
              }
              )()
            }
          </ul>
        </div>
        <button onClick={() => {
          // TODO check to see if person is leader
          socket.socketRef.emit("startGame", {
            gameId: currentGame.id
          })
        }}>Start Game</button>
      </div>
    );
  };

  const WritingPhase = function() {
    return (<p>Writing phase</p>)
  };

  ////////////////////////////////////////// RENDERING 


  return (
    <div className="Game">
      {renderPhase()}
    </div>
  );
};

export default Game;
