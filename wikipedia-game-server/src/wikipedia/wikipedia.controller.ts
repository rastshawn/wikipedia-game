import { Controller, Get, Post } from '@nestjs/common';
import { WikipediaService } from './wikipedia.service';

@Controller('wikipedia')
export class WikipediaController {
    constructor(private wikipediaService: WikipediaService) {};

    @Get('/random')
    async randomArticle() {
        // get a random article that has at least five sentences from simple wikipedia. 
        // https://simple.wikipedia.org/wiki/Special:Random
        const randomArticle = await this.wikipediaService.getRandomArticle();
        return randomArticle;
    }

    @Post('/trueSentence')
    randomSentence(article) {
        // find a random sentence that does not contain the article title in a given article.
        return "find a random sentence that does not contain the article title in a given article.";
    }

    @Post('/falseSentence')
    falseSentence(article) {
        // return a random sentence that is *not* in the article passed into it. 
        // it should be related, and ideally believable that it's from the article passed into it. 

        // look first at See Also
        // then maybe, if no See Also, 
        // gather the Categories at the bottom of the page, choose first category, choose random sentence from random article
        // gather all links on the page, choose a random sentence from random article
        return "find a random sentence that does not contain the article title in a given article.";
    }
}
