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

    async getTestArticle(): Promise<Article> {
        return new Article().init(
            {"batchcomplete": "",
            "query": {
              "normalized": [
                {
                  "from": "Ahmad_Obeidat",
                  "to": "Ahmad Obeidat"
                }
              ],
              "pages": {
                "709382": {
                  "pageid": 709382,
                  "ns": 0,
                  "title": "Ahmad Obeidat",
                  "extract": "Ahmad Obeidat (born 18 November 1938) is a Jordanian politician. He was Prime Minister of Jordan from 10 January 1984 to 4 April 1985. He was born in Hartha, Irbid. In May 2011, he launched the National Front for Reform.\n\n\n== References ==",
                  "categories": [
                    {
                      "ns": 14,
                      "title": "Category:1938 births"
                    },
                    {
                      "ns": 14,
                      "title": "Category:CS1 maint: archived copy as title"
                    },
                    {
                      "ns": 14,
                      "title": "Category:Living people"
                    },
                    {
                      "ns": 14,
                      "title": "Category:People stubs"
                    },
                    {
                      "ns": 14,
                      "title": "Category:Prime Ministers of Jordan"
                    }
                  ]
                }
              }
            }
          })
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
