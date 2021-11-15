import { Question } from "./question.dto";
import { Player, PlayerSerialized } from "./player.dto";
import { GameConfig } from "../interfaces/game-config.interface";
import { v4 as uuid } from 'uuid';

export class Game {
    id: string;
    currentQuestionCounter: number;
    questions: Question[]; // TODO This has to be hidden from the network tab. maybe make it private? Send via socket(?)
    players: Player[];
    phase: "writing"|"voting"|"lobby"|"scoring"|"endgame"|"";
    leadPlayerId: string; // the player in control of the game.
    config: GameConfig; // stored for possibly replaying with same config

    constructor(player: Player) {
      this.players = [];
      console.log(player.id);
      this.players[player.id] = player;
      this.leadPlayerId = player.id;
      this.currentQuestionCounter = 0;
      this.phase = "lobby";
      this.id = uuid();
      // note: questions still need to be loaded. 
      return this;
    }  

    getPlayer(playerId: string) {
      const player = this.players[playerId];
      if (player) {
        return player;
      } else {
        throw new Error(`getPlayer could not find player with id ${playerId}`)
      }
    }

    serialize(): GameSerialized {
      const serializedPlayers = Object.keys(this.players).map(key => {
        const player = this.players[key];
        return player.serialize()
      });


      return {
        players: serializedPlayers,
        id: this.id,
        currentQuestionCounter: this.currentQuestionCounter,
        questions: this.questions.map(question => question.serialize()),
        phase: this.phase,
        leadPlayerId: this.leadPlayerId,
        config: this.config
      }
    }
}
export interface GameSerialized {
  // necessary because the sockets cannot return themselves
  players: PlayerSerialized[];
  id: string;
  currentQuestionCounter: number;
  questions: Question[]; 
  phase: "writing"|"voting"|"lobby"|"scoring"|"endgame"|"";
  leadPlayerId: string; 
  config: GameConfig; 
}