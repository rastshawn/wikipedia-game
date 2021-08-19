import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WikipediaController } from './wikipedia/wikipedia.controller';
import { WikipediaService } from './wikipedia/wikipedia.service';
import { WikipediaModule } from './wikipedia/wikipedia.module';
import { GameModule } from './game/game.module';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { QuestionModule } from './game/question.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [WikipediaModule, GameModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'client'),
  })],
  controllers: [AppController, WikipediaController, GameController],
  providers: [AppService],
})
export class AppModule {}
