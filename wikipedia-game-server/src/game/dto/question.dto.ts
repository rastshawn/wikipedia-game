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

  serialize() {
    const ret = {
      ...this,
      submissions: this.submissions.map(submission => submission.serialize()),
      votes: this.votes.map(vote => vote.serialize())
    }

    return ret;
  }
}