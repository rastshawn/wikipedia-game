import { Module, HttpModule } from '@nestjs/common';
import { GameService } from './game.service';
import { QuestionModule } from './question.module';
import { EventGateway } from './events.gateway';

@Module({
    imports: [QuestionModule],
    providers: [GameService, EventGateway],
    exports: [GameService]
})
export class GameModule {}
