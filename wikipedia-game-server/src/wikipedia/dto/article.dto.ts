import {spawn} from 'child_process';
// TODO make this an articleService and articleModule instead
export class Article {
    title: string;
    extracts: string;
    rawResponse: any;
    rawPage: RawPage;
    modifiedText: string;
    sentences: any;
    trimmedTopicSentence: string;
    async init(rawResponse) {
      this.title = 'TITLE';
      this.extracts = 'TITLE';
      this.rawResponse = rawResponse;
      
      // Pages are stored in an object, the keys of which are variable - article IDs. 
      // our query only returns one at a time, so we can just always grab the first. 
      const articleId = Object.keys(this.rawResponse.query.pages)[0];
      this.rawPage = this.rawResponse.query.pages[articleId];

      this.modifiedText = this.stripHeadings(this.rawPage.extract);

      await this.tokenizeSentences();

      // remove parentheticals from the first sentence for computer answers
      this.trimmedTopicSentence = this.sentences[0]?.replace(/ \(.*\)/g, '');
      // TODO trim off references - test: Boppelsen
      // TODO trim off related pages - test: Kawasaki_Heavy_Industries_&_Nippon_Sharyo_C751B
      // TODO trim off related websites - test: Gustavo_Nieves_Campello
      // TODO fix issues with quoted text - test: Monosodium_glutamate, Turkwel_River
      // TODO exclude category / list pages - test: List_of_professional_wrestling_terms
      // TODO error on this specific person - test: Lee_Min_Ho
      // TODO remove list pages - test: List of states and union territories of India by area
	  this.title = this.rawPage.title;      
      // For topic sentence mode: strip out parentheses. https://stackoverflow.com/questions/55232131/about-parsing-parentheses-in-english-model
      return this;
    }

    private stripHeadings(extract) {
      const extractWithoutHeadings = extract.replace(/==.*==/g, '');
      const extractWithoutNewlines = extractWithoutHeadings.replace(/[\r\n]+/g, ' ');
      return extractWithoutNewlines;
    }

    private async tokenizeSentences() {
      let runPy = new Promise((success, nosuccess) => {
        const pyprog = spawn('"python3"', ['./language-processing/nlp.py', `"${this.modifiedText}"`], {shell:true});
    
        pyprog.stdout.on('data', function(data) {
            success(data);
        });
    
        pyprog.stderr.on('data', (data) => {
            nosuccess(data);
        });
      });
      try {
        let result = await runPy;
        this.sentences = JSON.parse(result.toString())?.sentences;
      } catch (e) {
        console.log(e.toString());
      }

    }
  }
  
  export interface RawPage {
    pageid: number;
    title: string; // formatted
    extract: string; // unformatted
    categories: Array<{title: string}>
  }
