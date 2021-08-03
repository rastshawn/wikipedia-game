import { v4 as uuid } from 'uuid';
export class Player {
    socket: any;
    name: string;
    id: string;
    score: number;

    // establish a socket when a new Player is created.
    async init({ name }: { name: string }) {
      this.id = uuid();
      this.name = name;
      this.socket = null; // TODO figure out socket generation
      this.score = 0;
      return this;
    }
}