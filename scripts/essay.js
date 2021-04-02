import Utilities from './utils.js';
import runTimer from './timer.js';
import Timer from './timer.js';
import API from './api.js'

export default class Essay {
  constructor() {
    this.minWordCount = 150;
    this.wordCount = 0;
    this.paragraphCount = 0;
    this.question = null;
    this.timer = null;
    this.api = null;
    this.timeToComplete = null;
    this.init();
  }

  init() {
    this.selectQuestion();
    this.startTimer();
    this.showPauseButton();
    this.enableFinishButtons();
    this.addEventListeners();
  }

  pauseEvent() {
    let pauseBtn = document.querySelector(".pause");

    pauseBtn.addEventListener('click', (e) => {
      this.togglePauseContinueButton(e.target);
      this.timer.stopTimer();
      this.disableTextArea();
    });
  }

  disableTextArea() {
    let textarea = document.querySelector(".essay");
    textarea.disabled = true;
  }

  continueEvent() {
    let continueBtn = document.querySelector(".continue");

    continueBtn.addEventListener('click', (e) => {
      this.togglePauseContinueButton(e.target);
      this.timer.continueTimer();
      this.enableTextArea();
    });
  }

  enableTextArea() {
    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }

  newQuestionEvent() {
    let newQuestionBtn = document.querySelector(".new-question");
    
    newQuestionBtn.addEventListener("click", () => {
      clearInterval(this.timer.timerId);
    });
  }

  notMinWordCount() {
    return this.wordCount < this.minWordCount;
  }

  finishEvent() {
    let finishBtns = document.querySelectorAll(".finish");
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    [...finishBtns].forEach(finishBtn => {
      finishBtn.addEventListener("click", (e) => {
        let essayContent = document.querySelector(".essay").value;

        this.disableButton(pauseBtn);
        this.disableButton(continueBtn)

        this.countParagraphs();

        this.api = new API(essayContent, this.generateReport.bind(this));
      });
    });
  }



  countParagraphs() {
    let essay = document.querySelector(".essay");
    let paragraphCount = essay.value.replace(/\n$/gm, '').split(/\n/).length;
    this.paragraphCount = paragraphCount;
  }

  createAreaForReport() {
    let mainArea = document.querySelector("main");
    let reportContainer = document.createElement("div");
    let reportContent = document.createElement("div");
    let writingAppSection = document.querySelector("#writing-app");

    reportContainer.classList.add("report-container");
    reportContent.classList.add("report-content");

    mainArea.style.display = "flex";
    mainArea.insertAdjacentElement("afterbegin", reportContainer);
    reportContainer.insertAdjacentElement("afterbegin", reportContent);
    reportContainer.style.height = this.getHeightOfEssay();
  }

  reduceWritingAppWidth() {
    let writingAppSection = document.querySelector("#writing-app");
    writingAppSection.style.width = "60%";
  }

  stopTimer() {
    clearInterval(this.timer.timerId); 
  }

  removeTimeEndedModal() {
    let timeEndedModal = document.querySelector("#modal-time-ended");

    if (timeEndedModal) {
      timeEndedModal.style.display = "none";
    }
  }

  removeButtons() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");
    let finishBtn = document.querySelector(".finish");

    pauseBtn.style.display = "none";
    continueBtn.style.display = "none";
    finishBtn.style.display = "none";
  }

  disableButton(buttonName) {
    buttonName.disabled = true;
  }

  generateReport(response) {
    let matches = response.matches;

    let essayReport = { 
                        timeElapsed: this.timer.showElapsedTime(),
                        paragraphCount: this.paragraphCount,
                        wordCount: this.wordCount,
                        spellingMistakes: [], 
                        grammarMistakes: [],
                        punctuationMistakes: [],
                        vocabularySuggestions: [],
                        other: [],
                     }
                    
    matches.forEach(match => {      
      let category = match.rule.id;

      switch (category) {
        case 'TYPOS':
          essayReport.spellingMistakes.push(match);
          break;
        case "SENTENCE_WHITESPACE":
        case "COMMA_PARENTHESIS_WHITESPACE":
          essayReport.punctuationMistakes.push(match);
          break;
        case "HE_VERB_AGR":
        case "MD_BASEFORM":
        case "AI_HYDRA_LEO_MISSING_A":
        case "PRP_VBG":
        case "SENTENCE_FRAGMENT":
          essayReport.grammarMistakes.push(match);
          break;
        case "IN_CHINA":
        case "IN_CHINA":
        default:
          essayReport.other.push(match);
      }
    });

    this.modifyScreenView();
    this.removeTimer();
    this.showCards(essayReport);
      // console.log("---------")
      // console.log(match.rule.category.id); // use this to sort mistakes into categories
      // console.log(match.shortMessage); // use this to provide a short description of mistake
      // console.log(match.message); // long message describing mistake
      // console.log(match.context.text); // seems to reproduce most of essay
      // console.log(match.offset); // use this to find mistake in essay; gives index where mistake begins
      // console.log(match.length); // use this with offset to highlight word/phrase with mistake
      // console.log(match.sentence); // use this to reproduce sentence
      // console.log(match.replacements); // use this to provide correction (is an array)
  }

  getHeightOfEssay() {
    let whitebox = document.querySelector(".white-box");
    let controlsContainer = document.querySelector("#controls-container");
    let offsetHeightOfWhitebox = whitebox.offsetHeight;
    let offsetHeightOfControlsContainer = controlsContainer.offsetHeight;
    console.log(offsetHeightOfWhitebox + offsetHeightOfControlsContainer + "px");
    return offsetHeightOfWhitebox + offsetHeightOfControlsContainer + "px";
  }

  removeTimer() {
    let timerBox = document.querySelector("#timer-box");
    timerBox.style.display = "none";
  }

  showCards(errors) {
    let reportContainer = document.querySelector(".report-container");
    let reportContent = document.querySelector(".report-content");
    let reports = this.templates["report-template"](errors);
    reportContent.innerHTML = reports;
  }

  modifyScreenView() {
    this.removeButtons(); 
    this.removeTimeEndedModal(); 
    this.stopTimer();
    this.reduceWritingAppWidth();
    this.disableTextArea();
    this.createAreaForReport(); 
  }

  addEventListeners() {
    this.pauseEvent();
    this.continueEvent();
    this.newQuestionEvent();
    this.finishEvent();
  }

  startTimer() {
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

  showPauseButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "block";
    continueBtn.style.display = "none";
  }

  showTimer() {
    let timerBox = document.querySelector("#timer-box");
    timerBox.style.display = "block";
  }

  togglePauseContinueButton(option) {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    if (option === pauseBtn || option.parentElement === pauseBtn) {
      pauseBtn.style.display = "none";
      continueBtn.style.display = "block";
    } else if (option === continueBtn || option.parentElement === continueBtn) {
      continueBtn.style.display = "none";
      pauseBtn.style.display = "block";
    }
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
    let whitebox = document.querySelector(".white-box")
    
    growWrapDiv.classList.add("grow-wrap", "dont-break-out");
    textarea.classList.add("essay");

    textarea.placeholder = "Write your essay here...";
    textarea.disabled = true;
    textarea.spellcheck = false;
    textarea.automcomplete="off";
    textarea.autocorrect="off";
    textarea.autocapitalize="off";

    whitebox.insertAdjacentElement("beforeend", growWrapDiv);
    growWrapDiv.insertAdjacentElement("beforeend", textarea);
    this.createWordCounter();
    this.trackWordCount();
    this.autoChangeTextarea();
    this.setTab();
  }

  createWordCounter() {
    let wordCountDiv = document.createElement("div");
    let whitebox = document.querySelector(".white-box")

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
    let questionContainer = document.querySelector(".white-box");

    this.removeInstructions();
    this.processTemplates();
    this.question = this.templates["question-template"]({question});

    questionContainer.innerHTML = this.question;
    this.createTextarea();
  }

  removeInstructions() {
    let whitebox = document.querySelector(".white-box");
    whitebox.innerHTML = "";
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