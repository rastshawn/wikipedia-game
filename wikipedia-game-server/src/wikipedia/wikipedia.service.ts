import { Injectable, HttpService } from '@nestjs/common';
import { Article } from './dto/article.dto';

const wiki: "simple" | "en" = "simple";
@Injectable()
export class WikipediaService {
    constructor(private httpService: HttpService) {};

    getSentence(article) {
        // return a random sentence that doesn't contain the article title
    }

    private async getRandomArticleTitle(): Promise<string> {
        // get a random article that has at least five sentences from simple wikipedia. 
        const response = await this.httpService.get(`https://${wiki}.wikipedia.org/wiki/Special:Random`).toPromise();
        const articleUrl = response.request.res.responseUrl;
        const articleSplit = articleUrl.split('/');
        return articleSplit[articleSplit.length - 1];
    }

    async getRandomArticle(numAttempts = 0): Promise<Article> {
      const officialTitle = await this.getRandomArticleTitle();

      // keep trying forever. To limit number of attempts, uncomment
      // if (numAttempts == 3) {
      //   // on final attempt, try it one last time without the try/catch
      //   return this.getArticle(officialTitle);
      // }

        /* TODO: enhancement. 
              Make criteria for what makes a good article
              (limit length in particular) and precalculate a db of articles by calling random articles over and over.
              On load, check that criteria are correct and if not update db
        */
       try {
          // await is here so that the catch block will be hit
          return await this.getArticle(officialTitle);
       } catch (e) {
          // retry
          return this.getRandomArticle(numAttempts++);
       }
        
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
    const response = await this.httpService.get(`https://${wiki}.wikipedia.org/w/api.php?action=query&prop=extracts|categories&explaintext&format=json&titles=${officialTitle}`).toPromise();
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
