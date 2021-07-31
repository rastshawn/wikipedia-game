import { Question } from "./question.dto";
import { Player } from "./player.dto";
import { GameConfig } from "../interfaces/game-config.interface";
import { v4 as uuid } from 'uuid';

export class Game {
    id: string;
    currentQuestionCounter: number;
    questions: Question[]; // TODO This has to be hidden from the network tab. maybe make it private? Send via socket(?)
    players: Player[];
    leadPlayerId: string; // the player in control of the game.
    config: GameConfig; // stored for possibly replaying with same config

    constructor(player: Player) {
      this.players = [player];
      this.leadPlayerId = player.id;
      this.currentQuestionCounter = 0;
      this.id = uuid();
      // note: questions still need to be loaded. 
      return this;
    }  
}