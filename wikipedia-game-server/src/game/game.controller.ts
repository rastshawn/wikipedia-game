import { Controller, Get, Post, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { Player } from './dto/player.dto';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService) {};

    @Get('/new')
    async startNewGame() {
        // create a socket for the player.
        // create a new player object. 
        const player = await new Player(null, null).init({name: "Joe Schmoe"});
        const game = await this.gameService.addGame({ player });

        return this.gameService.applyConfig({ 
            gameId: game.id,
            config: {
                numQuestions: 5
            }
        })
    }

    @Get('/:gameId')
    async getGame(@Param() params) {
        return this.gameService.getGame(
            params.gameId
        )
    }


    @Get('/:gameId/articles')
    async getArticles(@Param() params) {
        const game = this.gameService.getGame(
            params.gameId
        );

        return game.questions.map((question) => {
            return {
                title: question.article.title,
                sentence: question.article.trimmedTopicSentence
            }
        })
    }
    

    @Post('/trueSentence')
    randomSentence(article) {
        // find a random sentence that does not contain the article title in a given article.
        return "find a random sentence that does not contain the article title in a given article.";
    }

}
