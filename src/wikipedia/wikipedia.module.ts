import { Module, HttpModule } from '@nestjs/common';
import { WikipediaService } from './wikipedia.service';

@Module({
    imports: [HttpModule],
    providers: [WikipediaService]
})
export class WikipediaModule {}
