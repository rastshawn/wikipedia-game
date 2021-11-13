import { Player } from "./player.dto";
import { v4 as uuid } from 'uuid';
export class Submission {
    id: string;
    questionId: string;
    player: Player; // null if system
    text: string;

    constructor({questionId, text, player}: {questionId: string, text: string, player?:Player}) {
      this.id = uuid();
      this.questionId = questionId;
      this.player = player; // null if system
      this.text = text;
    }

  
}