import { Injectable, HttpService } from '@nestjs/common';
import { Article } from './dto/article.dto';

@Injectable()
export class WikipediaService {
    constructor(private httpService: HttpService) {};

    getSentence(article) {
        // return a random sentence that doesn't contain the article title
    }

    private async getRandomArticleTitle(): Promise<string> {
        // get a random article that has at least five sentences from simple wikipedia. 
        const response = await this.httpService.get('https://simple.wikipedia.org/wiki/Special:Random').toPromise();
        const articleUrl = response.request.res.responseUrl;
        const articleSplit = articleUrl.split('/');
        return articleSplit[articleSplit.length - 1];
    }

    async getRandomArticle(): Promise<Article> {
        const officialTitle = await this.getRandomArticleTitle();
        return this.getArticle(officialTitle);
    }

    /* update: make requests in parallel for game
    https://www.mediawiki.org/wiki/API:Etiquette
    */
   async getArticle(officialTitle): Promise<Article> {
    //https://www.mediawiki.org/wiki/API:Query
    // todo - use random generator from above link
    const response = await this.httpService.get(`https://simple.wikipedia.org/w/api.php?action=query&prop=extracts|categories&explaintext&format=json&titles=${officialTitle}`).toPromise();
    return new Article().init(response.data);
}

    findRelatedArticle() {
        // first look for 'see also'
        // then look for categories 
        // then look for just any link
        const foundArticle = {};
        return this.getSentence(foundArticle);
    }

    
}
