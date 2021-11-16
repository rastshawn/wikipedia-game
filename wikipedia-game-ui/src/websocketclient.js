// modified from https://stackoverflow.com/a/58435937
// and https://developer.okta.com/blog/2021/07/14/socket-io-react-tutorial
import socketIOClient from 'socket.io-client';

class WebSocketClient {
  static instance = null;

  callbacks = {};

  static getInstance() {
    if (!WebSocketClient.instance) WebSocketClient.instance = new WebSocketClient();
    return WebSocketClient.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  addCallbacks = (...callbacks) => {
    this.callbacks = { ...callbacks };
  };

  connect = () => {
    console.log('connect called');
    const path = '/';
    this.socketRef = socketIOClient(path);

    const socket = this.socketRef;
    console.log(socket.constructor.name);
    socket.on('connect', () => {
      console.log('connected');
      console.log(socket.id);
    });

    socket.on('error', (error) => {
      console.log(error);
    });

    // this.socketRef.onmessage = e => {
    //     console.log(e.data);
    //     //this.socketNewMessage(e.data);
    // };

    // this.socketRef.onerror = e => {
    //     console.log(e.message);
    // };

    socket.on('close', () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    });
  };

  state = () => this.socketRef.readyState;

  // waitForSocketConnection = (callback) => {
  //     const socket = this.socketRef;
  //     const recursion = this.waitForSocketConnection;
  //     setTimeout(
  //         () => {
  //             if (socket.readyState === 1) {
  //                 console.log("Connection is made")
  //                 if (callback != null) {
  //                     callback();
  //                 }
  //                 return;
  //             } else {
  //                 console.log("wait for connection...")
  //                 recursion(callback);
  //             }
  //         },
  //     1);
  // }
}

export default WebSocketClient.getInstance();
