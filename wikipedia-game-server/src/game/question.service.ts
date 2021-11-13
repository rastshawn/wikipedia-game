import { Injectable } from '@nestjs/common';
import { Game } from './dto/game.dto';
import { WikipediaService } from 'src/wikipedia/wikipedia.service';
import { Question } from './dto/question.dto';
import { Article } from 'src/wikipedia/dto/article.dto';
import { Submission } from './dto/submission.dto';

@Injectable()
export class QuestionService {
    constructor(private wikipediaService: WikipediaService) {};

    async create() {
        const newQuestion = new Question();
        // TODO make it getRandomArticle(), not getTestArticle();
        const article = await this.wikipediaService.getTestArticle();
        newQuestion.article = article;
        newQuestion.submissions.push(
            new Submission(
            {
              questionId: newQuestion.id,
              text: article.trimmedTopicSentence,
              player: null // null means system
            }
          )
        )
        return newQuestion;
    }
}
