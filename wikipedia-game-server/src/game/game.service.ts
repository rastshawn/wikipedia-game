import { Injectable } from '@nestjs/common';
import { Game } from './dto/game.dto';
import { Player } from './dto/player.dto';
import { Question } from './dto/question.dto';
import { GameConfig } from './interfaces/game-config.interface';
import { QuestionService } from './question.service';
import { Submission } from './dto/submission.dto';
import { Vote } from './dto/vote.dto';

import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    games: { [id: string]: Game }; // store games in memory

    constructor(private questionService: QuestionService) {
        this.games = {};
    };

    getQuestionScore(question: Question) {
        const pointsForBeingCorrect = 10;
        const pointsForBeingGuessed = 5;

        const playersBySubmissionId = []; // holds PlayerScore objects
        const playersByPlayerId = []; // holds same PlayerScore objects as above
        const playersArray = []; // holds same PlayerScore objects as above, but without specific keys

        // make array of players, indexed by submission ID
        question.submissions.forEach((submission) => {
            let playerId = 'SYSTEM';


            let playerOrSystemObj = {
                id: 'SYSTEM',
            };
            if (submission.player != null) {
                playerOrSystemObj = submission.player;
            }

            const newPlayerScoreObject = {
                player: playerOrSystemObj,
                score: 0,
                fooledArray: [], // holds playerNames of people who voted for their submission
                submissionText: submission.text
            };


            playersBySubmissionId[submission.id] = newPlayerScoreObject;
            playersByPlayerId[playerId] = newPlayerScoreObject;
            
            // if submission was not written by a computer
            if (submission.player.id != 'SYSTEM') {
                playersArray.push(newPlayerScoreObject);
            }
        })

        question.votes.forEach((vote) => {
            const submissionId = vote.submissionId;
            const playerWhoWroteSubmission = playersBySubmissionId[submissionId];
            const playerWhoVotedForSubmission = playersByPlayerId[vote.player.id];

            // this submission is the correct (computer's) submission if the player ID is SYSTEM
            if (playerWhoWroteSubmission.player.id == 'SYSTEM') {
                playerWhoVotedForSubmission.score += pointsForBeingCorrect;
            } else {
                playerWhoWroteSubmission.score += pointsForBeingGuessed;
                playerWhoWroteSubmission.fooledArray.push(playerWhoVotedForSubmission.name);
            }
        })

        return playersByPlayerId;
    }

    getPlayerScores(game: Game) {
        const playerScoreTuplets = [];

        game.players.forEach((player) => {
            playerScoreTuplets.push({
                name: player.name,
                playerId: player.id,
                score: player.score
            });
        })

        // TODO sort
        return playerScoreTuplets;
    }

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

    joinGame({ gameId, player }: { gameId: string, player: Player }) {
        const game = this.getGame(gameId);
        game.players[player.id] = player;

        // emit to all sockets that a player has joined
        // we don't really need to await this, but TODO we might want to know if it fails
        this.getAllPlayerSockets(game).forEach((socket) => {
            //socket.emit("newPlayer", game.serialize());
            socket.emit("newPlayer", player.serialize());
        })
        return game;
    };

    kickPlayer({ gameId, playerId }: { gameId: string, playerId: string }) {
        // TODO implement later; after minimum viable product. 
        // This will involve modifying the manage game state function to check for each player to vote specifically, rather than just number of submissions
        // end by tabulating game state
    };

    enterSubmission({ gameId, playerId, text }: { gameId: string, playerId: string, text: string }) {

        const game = this.getGame(gameId);
        const question = game.questions[game.currentQuestionCounter];
        question.submissions.push(
            new Submission({
              questionId: question.id,
              text: text,
              player: game.getPlayer(playerId)
            })
          );
        // end by tabulating game state
        this.manageGameState(game);
    };
    enterVote({ gameId, playerId, submissionId }: { gameId: string, playerId: string, submissionId: string }) {
        const game = this.getGame(gameId);
        const question = game.questions[game.currentQuestionCounter];
        const player = game.getPlayer[playerId];
        question.votes.push(
            new Vote(player, submissionId)
        );
        // end by tabulating game state
        this.manageGameState(this.getGame(gameId));
    };

    private manageGameState(game: Game) {
        const currentQuestion: Question = game.questions[game.currentQuestionCounter];
        let state: "writing"|"voting"|""|
        "scoring"|"endgame" = '';
        // have all write-ins been submitted? 
        if (currentQuestion?.submissions?.length != game.players.length) {
            // not all write-ins have been submitted
            state = "writing";
        } else if (currentQuestion?.votes?.length != game.players.length) {
            state = "voting";
        } else {
            // this question has had all submissions and votes, time to score
            state = "scoring";
            // emit state "scoring"
            this.scoreQuestion(currentQuestion);
            if (game.currentQuestionCounter == game.questions.length) {
                state = "endgame";
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
        const scores = this.getQuestionScore(question);
        
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

    getGameFromPlayer(playerId: string) {

    }

    getAllPlayerSockets(game: Game): Socket[] {
        return Object.keys(game.players).map(playerId => {
            return game.players[playerId].socket;
        })
    }

}
