import { Player } from "./player.dto";

export class Submission {
    id: string;
    questionId: string;
    player: Player;
    text: string;
    async init(rawResponse) {
      
      return this;
    }

  
}