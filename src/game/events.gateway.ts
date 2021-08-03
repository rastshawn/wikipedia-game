import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server } from 'socket.io';

@WebSocketGateway({
    handlePreflightRequest: (req: any, res: { writeHead: (arg0: number, arg1: { 'Access-Control-Allow-Headers': string; 'Access-Control-Allow-Origin': string; 'Access-Control-Allow-Credentials': boolean; }) => void; end: () => void; }) => {
      const headers = {
        'Access-Control-Allow-Headers': 'Authorization',
        'Access-Control-Allow-Origin': 'the page origin',
        'Access-Control-Allow-Credentials': true,
      };
      res.writeHead(200, headers);
      res.end();
    }
  })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

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
