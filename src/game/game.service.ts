import { Injectable } from '@nestjs/common';
import { Game } from './dto/game.dto';
import { Player } from './dto/player.dto';
import { GameConfig } from './interfaces/game-config.interface';
import { QuestionService } from './question.service';

@Injectable()
export class GameService {
    games: { [id: string]: Game }; // store games in memory

    constructor(private questionService: QuestionService) {
        this.games = {};
    };

    // When a player clicks to create a private lobby, this function is called.
    async addGame({ player }: { player: Player }): Promise<Game> {
        const newGame = await new Game(player);
        this.games[newGame.id] = newGame;
        return newGame;
    };

    // this moves the game from the lobby mode into gameplay. 
    // it should send a message along each player's socket.
    async startGame({ gameId, config }: { gameId: string, config: GameConfig }) {
        return null;
    };

    async applyConfig({ gameId, config }: { gameId: string, config: GameConfig }) {
        const game = this.games[gameId];

        if (game) {
            game.config = config;
            // fetch questions
            // TODO error handling!!!
            const questions = [];
            for (let i = 0; i < config.numQuestions; i++) {
              questions.push(this.questionService.create());
            }
            game.questions = await Promise.all(questions);
      
            return game;
        } else {
            // return 404? Error? 
            // TODO error handling
            throw new Error("No game found in applyCOnfig function");
        }


    }

    joinGame({ gameId }: { gameId: string }) {};
    kickPlayer({ gameId, playerId }: { gameId: string, playerId: string }) {};

    enterSubmission({ gameId, playerId, text, questionId }: { gameId: string, playerId: string, text: string, questionId: string }) {};
    enterVote({ gameId, playerId, submissionId }: { gameId: string, playerId: string, submissionId: string }) {};




    /*private*/ getGame(gameId: string) {
        return this.games[gameId];
    }


}
