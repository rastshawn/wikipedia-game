import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { WikipediaModule } from 'src/wikipedia/wikipedia.module';

@Module({
    imports: [WikipediaModule],
    providers: [QuestionService],
    exports: [QuestionService]
})
export class QuestionModule {}
