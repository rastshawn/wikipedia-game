import './game.css';
import { React, useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';

import socket from '../../websocketclient.js';
/*
logic: 

if game is not started, show lobby screen: 
  render lobby:
    fetch all current players, display
    listen for newPlayer event, add to players array
    
else, if game is going:

*/
function Game(props) {
  const [playerName, setPlayerName] = useState('Player');
  const [loading, setLoading] = useState(true);
  const [currentGame, setCurrentGame] = useState(null);
  const [userIsInGame, setUserIsInGame] = useState(false);

  const isUserInGame = () => {

    return currentGame?.players.some(player => {
      console.log(player.id);
      console.log(socket.socketRef.id);
      return player.id === socket.socketRef.id;
    });
  };

  let params = useParams();
  console.log("loaded");

  const updateGame = () => {
    socket.socketRef.emit("getGame", params.id, (response) => {
      setCurrentGame(response);
    });
  };

  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components

  useEffect(() => { // https://wattenberger.com/blog/react-hooks
    updateGame();

    socket.socketRef.on("newPlayer", (response) => {
      console.log(response);
      updateGame();
    });

    // see if player ID is in the game, if not display the 'join game' fields
    // then when player joins, show page


    // await functions can go here
    setLoading(false);
    return () => {
      // this gets called when the component is cleared
      //clearInterval(interval);
    };
  }, [])

  useEffect(() => { 
    console.log(currentGame);
    setUserIsInGame(isUserInGame());
    return () => {
      // this gets called when the component is cleared
      //clearInterval(interval);
    };
  }, [currentGame])

  const joinClick = () => {
    socket.socketRef.emit("joinGame", {
      name: playerName,
      gameId: params.id
    }, (response) => {
      setCurrentGame(response);
    });
  };
  
  if (loading) {
    return (
      <h1>loading...</h1>
    )
  } else {
    //  = (<div className="test">test</div>);
    return (
      <div className="Game">
        {
          (userIsInGame) ? '' : (
            <div className="join-form">
              <div className="form-group">
                <p>Nickname:</p>
                <input value={playerName} onChange={e=>setPlayerName(e.target.value)} />
              </div>
              <div className="form-group">
                <button onClick={joinClick}>Join Game</button>
              </div>
            </div>
          )
        }
        <h1>{params.id}</h1>
      </div>
    );
  }

  
}


export default Game;
