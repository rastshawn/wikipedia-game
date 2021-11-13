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
  const [testText, setTestText] = useState('');
  const [loading, setLoading] = useState(true);
  let params = useParams();
  console.log("loaded");

  // https://stackoverflow.com/questions/58432076/websockets-with-functional-components

  useEffect(() => { // https://wattenberger.com/blog/react-hooks
    socket.socketRef.emit("getGame", params.id, (response) => {

      console.log(response);

    });


    // await functions can go here
    setLoading(false);
    return () => {
      // this gets called when the component is cleared
      //clearInterval(interval);
    };
  }, [])
  
  if (loading) {
    return (
      <h1>loading...</h1>
    )
  } else {
    return (
      <div className="Game">
        <h1>{params.id}</h1>
        <div id="debug">
          <p>testText: {testText} </p>
          <input value={testText} onChange={e=>setTestText(e.target.value)} />
        </div>
      </div>
    );
  }

  
}

export default Game;
