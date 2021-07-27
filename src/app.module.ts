import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WikipediaController } from './wikipedia/wikipedia.controller';
import { WikipediaService } from './wikipedia/wikipedia.service';
import { WikipediaModule } from './wikipedia/wikipedia.module';

@Module({
  imports: [WikipediaModule, HttpModule],
  controllers: [AppController, WikipediaController],
  providers: [AppService, WikipediaService],
})
export class AppModule {}
