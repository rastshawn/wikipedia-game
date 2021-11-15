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
        return <VotingPhase />;
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
    const isUserCurrentlyInGame = isUserInGame();
    if (isUserCurrentlyInGame != userIsInGame) {
      setUserIsInGame(isUserCurrentlyInGame);
    }
    return () => {
      // this gets called when the component is cleared
      // clearInterval(interval);
    };
  }, [currentGame]);


  ////////////////////////////////////////// SUBCOMPONENTS 
  const LobbyPhase = () => {
    const joinClick = () => {
      socket.socketRef.emit('joinGame', {
        name: playerName,
        gameId: params.id,
      }, (response) => {
        setCurrentGame(response);
      });
    };
  const [playerName, setPlayerName] = useState('Player');
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
    const [userSubmission, setSubmission] = useState('answer goes here');
    const currentQuestion = currentGame.questions[currentGame.currentQuestionCounter];
    const title = currentQuestion.article.title;
    const sendSubmission = () => {
      socket.socketRef.emit("enterSubmission", {
        submission: userSubmission,
        gameId: currentGame.id
      }, (response) => {
        // TODO handle response
        console.log(response);
      }) 
    }
    return (
      <div className="writing">
        <h1>{title}</h1>
        <div className="submission-form">
              <div className="form-group">
                <p>Your guess:</p>
                <input value={userSubmission} onChange={(e) => setSubmission(e.target.value)} />
              </div>
              <div className="form-group">
                <button onClick={sendSubmission}>Submit</button>
              </div>
            </div>
      </div>
    )
  };

  const VotingPhase = function() {
    const currentQuestion = currentGame.questions[currentGame.currentQuestionCounter];
    const submissions = currentQuestion.submissions;
    return (
      <div className="writing">
        <ol>{
          submissions.map((submission) => {
            return (<li>{submission.text}</li>)
          })
        }</ol>
      </div>
    )
  };

  ////////////////////////////////////////// RENDERING 


  return (
    <div className="Game">
      {renderPhase()}
    </div>
  );
};

export default Game;
