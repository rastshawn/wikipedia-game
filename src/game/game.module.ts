import { Module, HttpModule } from '@nestjs/common';
import { GameService } from './game.service';
import { QuestionModule } from './question.module';

@Module({
    imports: [QuestionModule],
    providers: [GameService],
    exports: [GameService]
})
export class GameModule {}
