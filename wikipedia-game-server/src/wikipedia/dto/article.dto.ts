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
      this.title = this.rawPage.title;  
      this.modifiedText = this.stripHeadings(this.rawPage.extract);
      
      await this.tokenizeSentences();

      this.trimmedTopicSentence = this.sentences[0];

      if (!this.passesCriteria()) {
        console.log(`Criteria fail: ${this.title}`)
        throw new Error("Did not pass criteria");
      }
      // TODO trim off references - test: Boppelsen
      // TODO trim off related pages - test: Kawasaki_Heavy_Industries_&_Nippon_Sharyo_C751B
      // TODO trim off related websites - test: Gustavo_Nieves_Campello
      // TODO fix issues with quoted text - test: Monosodium_glutamate, Turkwel_River
      // TODO exclude category / list pages - test: List_of_professional_wrestling_terms
      // TODO error on this specific person - test: Lee_Min_Ho
      // TODO remove list pages - test: List of states and union territories of India by area
    
      // For topic sentence mode: strip out parentheses. https://stackoverflow.com/questions/55232131/about-parsing-parentheses-in-english-model
      return this;
    }

    private passesCriteria() {
      let ret = true;

      const failsMaxLengthCheck = this.trimmedTopicSentence.split(' ').length > 11; // maybe just check commas instead
      const failsMinLengthCheck = this.trimmedTopicSentence.split(' ').length < 3;
      if (failsMaxLengthCheck || failsMinLengthCheck){
        return false;
      }

      // make sure topic sentence ends with period
      const lenTopicSentence = this.trimmedTopicSentence.length;
      const endsWithPeriod = this.trimmedTopicSentence.substring(lenTopicSentence - 1) == '.';
      if (!endsWithPeriod) {
        return false;
      }

      // banned titles: 
      const bannedTitlePhrases = [
        "List of",
      ];
      const failsTitleBlacklistCheck = bannedTitlePhrases.some((bannedPhrase) => {
        return this.title.indexOf(bannedPhrase) != -1;
      });
      if (failsTitleBlacklistCheck) {
        return false;
      }

      // banned categories
      const bannedCategoryPhrases = [
        "Category:List", // page category cannot be a list
      ]
      const failsCategoryCheck = bannedCategoryPhrases.some((bannedPhrase) => {
        return this.rawPage.categories.some((category) => {
          return category.title.indexOf(bannedPhrase) != -1;
        })
      })
      if (failsCategoryCheck) {
        return false;
      }

      // TODO verify that the topic sentence has a verb in it. Example: Czterdziestolatek
      return true;
    }
    private stripHeadings(extract) {
      const extractWithoutHeadings = extract.replace(/==.*==/g, '');
      const extractWithoutNewlines = extractWithoutHeadings.replace(/[\r\n]+/g, ' ');
      // remove parentheticals from the first sentence for computer answers
      const extractWithoutParentheticals = extractWithoutNewlines.replace(/(\s)?\([^\)]*\)/g, '');
      const extractWithoutDoubleSpaces = extractWithoutParentheticals.replace(/\s\s/g, ' ');
      return extractWithoutDoubleSpaces;
    }

    private async tokenizeSentences() {
      // convert article to base64 to pass to python without errors
      let buff = Buffer.from(this.modifiedText);
      let base64data = buff.toString('base64');
      let runPy = new Promise((success, nosuccess) => {
        const pyprog = spawn('"python3"', ['./language-processing/nlp.py', `${base64data}`], {shell:true});
    
        pyprog.stdout.on('data', function(data) {
            success(data);
        });
    
        pyprog.stderr.on('data', (data) => {
            nosuccess(data);
        });
      });
      try {
        let result = await runPy;
        const decodeBuffer = Buffer.from(result.toString(), 'base64');
        const decodedText = decodeBuffer.toString('utf-8')
        this.sentences = JSON.parse(decodedText)?.sentences;
      } catch (e) {
        console.log(`
Tokenize failed with ${this.rawPage.title}:
    ${base64data}
==============`);
        throw e;
      }

    }
  }
  
  export interface RawPage {
    pageid: number;
    title: string; // formatted
    extract: string; // unformatted
    categories: Array<{title: string}>
  }
