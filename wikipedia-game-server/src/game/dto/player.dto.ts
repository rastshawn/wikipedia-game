import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
export class Player {
    socket: any;
    name: string;
    id: string;
    score: number;

    constructor(socket: Socket, name: string) {
      //this.id = uuid();
      this.id = socket.id;
      this.name = name;
      this.socket = socket; // TODO figure out socket generation
      this.score = 0;
    }

    // TODO remove init function
    // establish a socket when a new Player is created.
    async init({ name }: { name: string }) {
      this.id = uuid();
      this.name = name;
      this.socket = null; // TODO figure out socket generation
      this.score = 0;
      return this;
    }

    serialize(): PlayerSerialized {
      return {
        id: this.id,
        name: this.name,
        score: this.score
      };
    }
}

export interface PlayerSerialized {
  // necessary because the sockets cannot return themselves
  id: string;
  name: string;
  score: number;
}