import { Injectable } from '@nestjs/common';
import { Game } from './dto/game.dto';
import { WikipediaService } from 'src/wikipedia/wikipedia.service';
import { Question } from './dto/question.dto';

@Injectable()
export class QuestionService {
    constructor(private wikipediaService: WikipediaService) {};

    async create() {
        const newQuestion = new Question();
        const article = await this.wikipediaService.getRandomArticle();
        newQuestion.article = article;
        return newQuestion;
    }
}
