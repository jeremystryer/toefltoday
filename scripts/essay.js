import Utilities from './utils.js';
import runTimer from './timer.js';
import Timer from './timer.js';
import API from './api.js'

export default class Essay {
  constructor() {
    this.minWordCount = 150;
    this.wordCount = 0;
    this.paragraphCount = 0;
    this.wordCountPerParagraph = [];
    this.question = null;
    this.timer = null;
    this.api = null;
    this.timeToComplete = null;
    this.init();
  }

  init() {
    this.selectQuestion();
    this.resetTimer();
    this.showPauseButton();
    this.enableFinishButtons();
  }

  notMinWordCount() {
    return this.wordCount < this.minWordCount;
  }

  countParagraphs() {
    let essay = document.querySelector(".essay");
    this.paragraphCount = this.splitEssayIntoParagraphs().length;
  }

  createAreaForReport() {
    let mainArea = document.querySelector("main");
    let wrapper = document.createElement("div");
    let reportContainer = document.createElement("div");
    let reportContent = document.createElement("div");
    let writingApp = document.querySelector("#writing-app");
    let newQuestionBtn = document.querySelector(".new-question");
    
    mainArea.style.display = "flex";
    wrapper.classList.add("wrapper");
    
    reportContainer.classList.add("report-container");
    reportContent.classList.add("report-content");

    wrapper.classList.add("flex-1");

    writingApp.classList.remove("center");
    writingApp.classList.add("flex-2");

    mainArea.insertAdjacentElement("afterbegin", wrapper);
    wrapper.insertAdjacentElement("afterbegin", reportContainer);
    reportContainer.insertAdjacentElement("afterbegin", reportContent);

    newQuestionBtn.classList.remove("margin-right");
  }

  // getCurrentHeightofEssay() {
  //   let writingApp = document.querySelector("#writing-app");
  //   let writingAppHeight = writingApp.offsetHeight;
  //   console.log(writingAppHeight);
  //   return writingAppHeight + "px";
  // }

  // reduceWritingAppWidth() {
  //   let writingAppSection = document.querySelector("#writing-app");
  //   writingAppSection.style.width = "55%";
  // }

  // removeTimeEndedModal() {
  //   let timeEndedModal = document.querySelector("#modal-time-ended");

  //   if (timeEndedModal) {
  //     timeEndedModal.style.display = "none";
  //   }
  // }

  removeButtons() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");
    let finishBtn = document.querySelector(".finish");
    let controls = document.querySelector("#controls");

    pauseBtn.style.display = "none";
    continueBtn.style.display = "none";
    finishBtn.style.display = "none";
  }

  insertButtons() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");
    let finishBtn = document.querySelector(".finish");

    pauseBtn.style.display = "block";
    finishBtn.style.display = "block";
  }

  generateReport(response) {
    let matches = response.matches;

    let essayReport = { 
                        timeElapsed: this.timer.showElapsedTime(),
                        paragraphCount: this.paragraphCount,
                        wordCount: this.wordCount,
                        wordCountPerParagraph: this.wordCountPerParagraph,
                        spellingMistakes: [], 
                        grammarMistakes: [],
                        punctuationMistakes: [],
                        otherMistakes: [],
                     }

    matches.forEach(match => {      
      let category = match.rule.id;

      switch (category) {
        case "SENTENCE_WHITESPACE":
        case "COMMA_PARENTHESIS_WHITESPACE":
        case "COMMA_COMPOUND_SENTENCE_2":
        case "EN_COMPOUNDS":
        case "MORFOLOGIK_RULE_EN_US":
        case "SENT_START_CONJUNCTIVE_LINKING_ADVERB_COMMA":
          essayReport.punctuationMistakes.push(match);
          break;
        case 'TYPOS':
        case "TIS":
        case "CONFUSION_RULE_YOU_YOUR":
          essayReport.spellingMistakes.push(match);
          break;
        case "HE_VERB_AGR":
        case "MD_BASEFORM":
        case "AI_HYDRA_LEO_MISSING_A":
        case "AI_HYDRA_LEO_MISSING_THE":
        case "AI_HYDRA_LEO_MISSING_TO":
        case "PRP_VBG":
        case "SENTENCE_FRAGMENT":
        case "EN_A_VS_AN":
        case "AI_HYDRA_LEO_MISSING_IN":
        case "THE_SUPERLATIVE":
        case "CONFUSION_RULE_WERE_WHERE":
          essayReport.grammarMistakes.push(match);
          break;
        case "IN_CHINA":
        case "IN_CHINA":
        default:
          essayReport.otherMistakes.push(match);
      }
    });

    this.modifyScreenView();
    this.removeTimer();
    this.showCards(essayReport);
  }

  countWordsPerParagraph() {
    let paragraphs = this.splitEssayIntoParagraphs();
  
    paragraphs.forEach((paragraph, index) => {
      let paragraphNumber = index + 1;
      let wordCount = paragraph.split(" ").length;
      let paragraphWithWordCount = {};
      paragraphWithWordCount.paragraph = paragraphNumber;
      paragraphWithWordCount.wordCount = wordCount;
      this.wordCountPerParagraph.push(paragraphWithWordCount)
    });
  }

  splitEssayIntoParagraphs() {
    let essay = document.querySelector(".essay");
    return essay.value.replace(/\n$/gm, '').split(/\n/);
  }

  // getHeightOfEssay() {
  //   let whitebox = document.querySelector(".whitebox");
  //   let controls = document.querySelector("#controls");
  //   let offsetHeightOfWhitebox = whitebox.offsetHeight;
  //   let offsetHeightOfControls = controls.offsetHeight;
  //   return offsetHeightOfWhitebox + offsetHeightOfControls + "px";
  // }

  removeTimer() {
    let timerBox = document.querySelector("#timer-box");
    timerBox.style.display = "none";
  }

  showCards(errors) {
    let reportContainer = document.querySelector(".report-container");
    let reportContent = document.querySelector(".report-content");
    let reportPartial = document.querySelector("#report-template-section-partial").innerHTML;
    let reports;

    Handlebars.registerPartial("reportTemplateSectionPartial", reportPartial);
    reports = this.templates["report-template"](errors);
    reportContent.innerHTML = reports;
  }

  modifyScreenView() {
    this.removeButtons(); 
    // this.removeTimeEndedModal(); 
    // this.reduceWritingAppWidth();
    this.disableTextArea();
    this.createAreaForReport(); 
  }

  resetTimer() {
    if (this.timer) {
      console.log('reset');
      clearInterval(this.timer.timerId);
    }

    this.timer = new Timer();
    this.showTimer();
    this.enablePauseButton();
  }

  enablePauseButton() {
    let pauseBtn = document.querySelector(".pause");
    pauseBtn.disabled = false;
  }

  enableFinishButtons() {
    let finishBtns = document.querySelectorAll(".finish");
  
    [...finishBtns].forEach(btn => {
      btn.disabled = false;
    });
  }

  disableTextArea() {
    let textarea = document.querySelector(".essay");
    textarea.disabled = true;
  }

  showPauseButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "block";
    continueBtn.style.display = "none";
  }

  showTimer() {
    let timerBox = document.querySelector("#timer-box");
    timerBox.style.display = "inline-block";
  }

  showContinueButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "none";
    continueBtn.style.display = "block";
  }

  trackWordCount() {
    let essay = document.querySelector(".essay");

    essay.addEventListener("keyup", (e) => {
      let content = essay.value;
      let wordCountDiv = document.querySelector(".word-count");
      let count = 0; 

      let array = content.split(/[\s\r\n\t]/);
    
      for (let i = 0; i < array.length; i += 1) {
        if (array[i] !== " " && Boolean(array[i].match(/[a-z]/ig))) { 
          count += 1;
        } 
      } 
      
      this.wordCount = count;
      wordCountDiv.innerText = `${count} words`;
    });
  } 

  createTextarea() {
    let textarea = document.createElement("textarea");
    let growWrapDiv = document.createElement("div");
    let whitebox = document.querySelector(".whitebox");
    let textContainer = document.querySelector("#text-container");
    
    growWrapDiv.classList.add("grow-wrap", "dont-break-out");
    textarea.classList.add("essay");

    textarea.placeholder = "Write your essay here...";
    textarea.disabled = true;
    textarea.spellcheck = false;
    textarea.automcomplete="off";
    textarea.autocorrect="off";
    textarea.autocapitalize="off";

    // whitebox.insertAdjacentElement("beforeend", growWrapDiv);
    textContainer.insertAdjacentElement("beforeend", growWrapDiv);
    growWrapDiv.insertAdjacentElement("beforeend", textarea);
    this.createWordCounter();
    this.trackWordCount();
    this.autoChangeTextarea();
    this.setTab();
  }

  createWordCounter() {
    let wordCountDiv = document.createElement("div");
    let whitebox = document.querySelector(".whitebox")
    let existingWordCounter = document.querySelector(".word-count");

    if (existingWordCounter) {
      existingWordCounter.remove();
      // wordCounter.remove();
    }

    whitebox.insertAdjacentElement("beforeend", wordCountDiv);
    wordCountDiv.classList.add("word-count");
    wordCountDiv.innerText = "0 words";
  }

  autoChangeTextarea() {
    const grower = document.querySelector(".grow-wrap");
    const textarea = grower.querySelector(".essay");

    textarea.addEventListener("input", () => {
      grower.dataset.replicatedValue = textarea.value;
    });
  }

  insertQuestion(question) {
    // let whiteboxContainer = document.querySelector(".whitebox");
    let textContainer = document.querySelector("#text-container");

    this.removeInstructions();
    this.processTemplates();
    this.question = this.templates["question-template"]({question});

    textContainer.innerHTML = this.question;
    
    this.createTextarea();
  }

  removeInstructions() {
    // let whiteboxContainer = document.querySelector(".whitebox");
    // whiteboxContainer.innerHTML = "";

    let textContainer = document.querySelector("#text-container");
    textContainer.innerHTML = "";
  }

  selectQuestion() {
    fetch("./test-questions.json")
    .then(response => response.json())
    .then(json => this.insertQuestion(Utilities.getRandom(json.questions)));
  }

  processTemplates() {
    this.templates = {};

    document.querySelectorAll("script[type='text/x-handlebars']").forEach(tmpl => {
      this.templates[tmpl["id"]] = Handlebars.compile(tmpl["innerHTML"]);
    });
  }

  setTab() {
    let essay = document.querySelector(".essay");
    
    essay.addEventListener("keydown", function(e) {
      
      if (e.keyCode === 9) {
        e.preventDefault();
        let start = this.selectionStart;
        let end = this.selectionEnd;

        this.value = this.value.substring(0, start) +
          "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;
      }
    });
  }
}