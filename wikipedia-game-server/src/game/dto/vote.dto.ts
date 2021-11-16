import { Player } from "./player.dto";
import { v4 as uuid } from 'uuid';

export class Vote {
    id: string;
    player: Player;
    submissionId: string;
    constructor(player: Player, submissionId: string) {
      this.id = uuid();
      this.player = player;
      this.submissionId = submissionId;
      return this;
    }

    serialize() {
      return {
        ...this,
        player: this.player.serialize()
      }
    }

  
}