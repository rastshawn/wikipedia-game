import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    constructor(private gameService: GameService) {}

    /*
        each page that loads, make the same readout: 
        gameId:
        name:
        [join game] - note: if gameID empty, this creates a new game
        // currentGameId //

        -- lobby section
        // players //

        -- game section
        // question //
        answer:
        [submit]

        -- vote section
        [answer] [answer] [answer]
        answerId: 
        [submit]

    */

    async handleConnection() {
        console.log("CONNECT");
        // A client has connected
        // Notify connected clients of current users
        this.server.send("test");
      }
      async handleDisconnect() {
        // A client has disconnected
        // Notify connected clients of current users
        this.server.emit('users', null);
      }
    

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
      return data;
    }
}
//OnGatewayDisconnect	Forces to implement the handleDisconnect() method. Takes library-specific client socket instance as an argument.
