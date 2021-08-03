import { Article } from "src/wikipedia/dto/article.dto";
import { Vote } from "./vote.dto";
import { Submission } from "./submission.dto";
import { v4 as uuid } from 'uuid';
export class Question {
    id: string;
    article: Article;
    submissions: Submission[];
    votes: Vote[];
    constructor() {
      this.id = uuid();
      this.submissions = [];
      this.votes = [];
      return this;
    }

  
}