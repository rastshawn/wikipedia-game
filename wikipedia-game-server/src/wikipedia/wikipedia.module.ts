import { Module, HttpModule } from '@nestjs/common';
import { WikipediaService } from './wikipedia.service';

@Module({
    imports: [HttpModule],
    providers: [WikipediaService],
    exports: [WikipediaService]
})
export class WikipediaModule {}
