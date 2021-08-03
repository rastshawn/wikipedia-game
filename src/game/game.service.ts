import { Injectable } from '@nestjs/common';
import { Game } from './dto/game.dto';
import { Player } from './dto/player.dto';
import { Question } from './dto/question.dto';
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
        const game = this.getGame(gameId);

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
            throw new Error("No game found in applyConfig function");
        }


    }

    joinGame({ gameId }: { gameId: string }) {};
    kickPlayer({ gameId, playerId }: { gameId: string, playerId: string }) {
        // TODO implement later; after minimum viable product. 
        // This will involve modifying the manage game state function to check for each player to vote specifically, rather than just number of submissions
        // end by tabulating game state
    };

    enterSubmission({ gameId, playerId, text, questionId }: { gameId: string, playerId: string, text: string, questionId: string }) {

        // end by tabulating game state
        this.manageGameState(this.getGame(gameId));
    };
    enterVote({ gameId, playerId, submissionId }: { gameId: string, playerId: string, submissionId: string }) {

        // end by tabulating game state
        this.manageGameState(this.getGame(gameId));
    };

    private manageGameState(game: Game) {
        const currentQuestion: Question = game.questions[game.currentQuestionCounter];
        let state: "writing"|"voting"|""|"afterQuestion"|"afterLastQuestion" = '';
        // have all write-ins been submitted? 
        if (currentQuestion?.submissions?.length != game.players.length) {
            // not all write-ins have been submitted
            state = "writing";
        } else if (currentQuestion?.votes?.length != game.players.length) {
            state = "voting";
        } else {
            // this question has had all submissions and votes, time to score
            state = "afterQuestion";
            this.scoreQuestion(currentQuestion);
            if (game.currentQuestionCounter == game.questions.length) {
                state = "afterLastQuestion";
            }
        }
        game.state = state;
        // TODO send state to all open sockets
        game.players.forEach((player) => {
            // player.socket.send(state); // maybe send entire game, plus state
        })
        return state;
    }

    advanceToNextQuestion(gameId: string) {
        const game = this.getGame(gameId);
        game.currentQuestionCounter++;
        this.manageGameState(game);
    }

    private scoreQuestion(question: Question) {
        const pointsForBeingCorrect = 10;
        const pointsForBeingGuessed = 5;
        question.votes.forEach((vote) => {
            const relatedSubmission = question.submissions.filter(submission => submission.id == vote.submissionId)[0];
            // vote is correct if the player that created the submission is null
            // otherwise, give points to that player
            if (relatedSubmission.player == null) {
                vote.player.score += pointsForBeingCorrect;
            } else {
                relatedSubmission.player.score += pointsForBeingGuessed;
            }
        })
    }

    // grab all player scores, sort, and add ranking to them.
    getFinalScores(game: Game) {
        const scoreObjects = game.players.map((player) => {
            return {
                name: player.name,
                score: player.score
            }
        });
        const sortedScoreObjects = scoreObjects.sort((a, b) => b.score - a.score);
        return sortedScoreObjects.map((scoreObj, index) => {
            return {
                ...scoreObj,
                rank: index + 1
            }
        });
    }


    /*private*/ getGame(gameId: string) {
        const game = this.games[gameId];
        if (game) return game;
        else throw new Error("no game found for gameId");
    }


}
