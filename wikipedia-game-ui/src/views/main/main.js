import './main.css';
//import logo from './logo.svg';
import { React, useState, /*, useEffect*/ 
useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';



import socket from '../../websocketclient.js';

function Main() {
  // useful for state reference
  // https://ru.react.js.org/tutorial/tutorial.html#showing-the-past-moves
  const [playerName, setPlayerName] = useState('Player');
  let navigate = useNavigate();
  useEffect(() => {
    // create the sockets if not done yet
    socket.socketRef.emit("events", {a: 1, b: 2}, (response) => {
      console.log("<MAIN>")
      console.log(response);
      console.log("</MAIN>");
    });
  });
  const newGameClick = () => {
    // send socket

    // redirect to new game ID

    const gameId = "new game id"
    navigate(`/game/${gameId}` /* , {state: partialUser } */)
    
    //window.location.pathname = `/game/${gameId}`;
  };
  
  return (
    <div className="Main">
      <div id="newGameForm">
        <div className="form-group">
          <p>nickname:</p>
          <input value={playerName} onChange={e=>setPlayerName(e.target.value)} />
        </div>
        <div className="form-group">
          <button onClick={newGameClick}>Start New Game</button>
          {/* <Link to="/game/new_game">last-ditch-effort</Link> */}
        </div>
      </div>
    </div>
  );
}

export default Main;
