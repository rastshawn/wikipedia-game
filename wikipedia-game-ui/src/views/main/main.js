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
  const [numQuestions, setNumQuestions] = useState('10');
  let navigate = useNavigate();
  // useEffect(() => {
  //   // create the sockets if not done yet

  // });
  const newGameClick = () => {
    // send socket
    socket.socketRef.emit("createNewGame", {
      name: playerName,
      config: {
        numQuestions
      }
    }, (response) => {
      console.log("createNewGame");
      //console.log(response);

      // redirect to new game ID
      const gameId = response.game.id;
      navigate(`/game/${gameId}` /* , {state: partialUser } */)
    });

    
    //window.location.pathname = `/game/${gameId}`;
  };
  
  return (
    <div className="Main">
      <div id="playerForm">
        <div className="form-group">
          <p>nickname:</p>
          <input value={playerName} onChange={e=>setPlayerName(e.target.value)} />
        </div>
      </div>
      <div id="newGameForm">
        <div className="form-group">
          <p>numQuestions:</p>
          <input value={numQuestions} onChange={e=>setNumQuestions(e.target.value)} />
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
