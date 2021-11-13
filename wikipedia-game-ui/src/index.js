import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Main from './views/main/main.js';
import Game from './views/game/game.js';

// load the socket from the beginning
import socket from './websocketclient.js';
socket.connect()

// setting up a global state: https://www.thisdot.co/blog/creating-a-global-state-with-react-hooks
ReactDOM.render(
  <React.StrictMode>
    {/* <Main /> */}
    <Router>
      <Routes>
        <Route index element={<Main />}/>
        <Route path="/game/:id" element={<Game />}/> {/*The component is rendered with any route props*/}
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
