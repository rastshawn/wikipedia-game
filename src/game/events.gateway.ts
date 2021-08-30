import { Injectable } from '@nestjs/common';
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Submission } from './dto/submission.dto';

/**
 * Handles the web sockets, which themselves handle game events. 
 * 
 * This contains all in-game communication between server and client. 
 */
@WebSocketGateway()
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer() server: Server;

    constructor(private gameService: GameService) {}

    /*
        each page that loads, make the same readout: 
        gameId:
        name:
        [join game] - note: if gameID empty, this creates a new game
        // currentGameId //

        -- lobby section
        // players //

        -- game section
        // question //
        answer:
        [submit]

        -- vote section
        [answer] [answer] [answer]
        answerId: 
        [submit]

    */

    async handleConnection() {

      // NOTE important to only emit to sockets in the current game
        console.log("CONNECT");
        // A client has connected
        // Notify connected clients of current users
        this.server.send("test");
      }
      async handleDisconnect() {
        // A client has disconnected
        // Notify connected clients of current users
        this.server.emit('users', null);
      }
    

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string): string {
      return data;
    }


    // game functions from front end

    /////// LOBBY
    @SubscribeMessage('loadPlayers')
    loadPlayers(@MessageBody() gameId: string): string {
      return gameId;
    }
    ////// END LOBBY


    ////// QUESTION MODE
    // called while in Question mode, returns the current question for a given gameId
    @SubscribeMessage('getCurrentQuestion')
    getCurrentQuestion(@MessageBody() gameId: string): string {
      const game = this.gameService.getGame(gameId);

      const question = game.questions[game.currentQuestionCounter];
      if (question?.article?.title) {
        return question.article.title;
      } else {
        throw new Error("Could not fetch a question");
      }
    }

    @SubscribeMessage('enterSubmission') 
    enterSubmission(
      @MessageBody() { submission, gameId }: {submission: string, gameId: string}, 
      @ConnectedSocket() client: Socket
    ): void {
      // try to get player ID from socket?
      // try to get the current game from the player ID? 
      const playerId = client.id;

      return this.gameService.enterSubmission({
        gameId,
        playerId,
        text: submission
      });
    }
    ///// END QUESTION MODE

    ///// VOTE MODE
    /* returns the submissions for the current question, for voting */
    @SubscribeMessage('getSubmissions') 
    getSubmissions(@MessageBody() { gameId, playerId }): Submission[] {

      // if player ID specified, return submissions EXCEPT for that player

      // try to get player ID from socket?
      // try to get the current game from the player ID? 
      const game = this.gameService.getGame(gameId);
      const question = game.questions[game.currentQuestionCounter];
      const allSubmissions = question.submissions;

      const returnSubmissions = [];
      allSubmissions.forEach((submission) => {
        if (submission.player.id != playerId) {
          returnSubmissions.push(submission)
        }
      })
      return returnSubmissions;
    }

    /* records a player vote */
    @SubscribeMessage('sendVote') 
    sendVote(
      @MessageBody() {submissionId, gameId}: {submissionId: string, gameId: string},
      @ConnectedSocket() client: Socket
    ): void {
      let playerId = client.id;
      return this.gameService.enterVote({
        gameId,
        playerId, 
        submissionId
      });
    }
    ///// END VOTE MODE

    ///// SCORE MODE
    @SubscribeMessage('getScores') 
    getScores(@MessageBody() gameId: string) {
      // returns the scoring information from the last round, with votes etc
      // also returns the list of players and their scores
      // scores are returned for the previous round because the question counter will already have advanced

      /*
          players: [{
            playerName: "name",
            playerSubmission: "The Alamo is an American brand of dog food.",
            otherGuessers: ["name2, name3"],
            addedScore: 15, // displayed as +15
            totalScore: 420
          }],
          title: "The Alamo",
          correctSubmission: "The Alamo is an old building in downtown San Antonio.",
      */
      const game = this.gameService.getGame(gameId);
      const question = game.questions[game.currentQuestionCounter-1]; // question counter has already advanced

      const questionScoreIndexedByPlayerId = this.gameService.getQuestionScore(question);

      const talliedScores = this.gameService.getPlayerScores(game);

      const playerScoreCompleteObjects = talliedScores.map((playerScoreTuplet) => {
        const playerQuestionScore = questionScoreIndexedByPlayerId[playerScoreTuplet.playerId];
        return {
          playerName: playerScoreTuplet.name,
          addedScore: playerQuestionScore.score,
          otherGuessers: playerQuestionScore.fooledArray,
          totalScore: playerScoreTuplet.score
        }
      });


      // TODO sort
      return {
        title: question.article.title,
        correctSubmission: question.article.trimmedTopicSentence,
        players: playerScoreCompleteObjects
      };
    }
    ///// END SCORE MODE

    ///// ENDGAME MODE
    @SubscribeMessage('finalTally') 
    finalTally(@MessageBody() gameId: string) {
      // returns the scoring information from the last round, with votes etc
      // also returns the list of players and their scores
      const game = this.gameService.getGame(gameId);
      const talliedScores = this.gameService.getPlayerScores(game);
      return talliedScores;
    }
    ///// END ENDGAME MODE
  }