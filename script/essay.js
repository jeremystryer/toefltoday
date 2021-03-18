import Utilities from './utils.js';
import runTimer from './timer.js';
import Timer from './timer.js';

export default class Essay {
  constructor() {
    this.totalRemainingSeconds = 1800;
    this.init();
  }

  init() {
    this.selectQuestion();
    this.startEssay();
    this.timer = new Timer();
  }

  createTextarea() {
    let textarea = document.createElement("textarea");
    let growWrapDiv = document.createElement("div");
    let whitebox = document.querySelector(".white-box")
    
    growWrapDiv.classList.add("grow-wrap", "dont-break-out");
    textarea.classList.add("essay");

    textarea.placeholder = "Write your essay here...";
    textarea.disabled = true;
    
    whitebox.insertAdjacentElement("beforeend", growWrapDiv);
    growWrapDiv.insertAdjacentElement("beforeend", textarea);
    
    this.autoChangeTextarea();
    this.setTab();
  }

  startEssay() {
    let timerBox = document.querySelector("#timer-box");
    let pauseBtn = document.querySelector(".pause");

    this.createTextarea();
    timerBox.style.display = "block";
  }

  autoChangeTextarea() {
    const grower = document.querySelector(".grow-wrap");
    const textarea = grower.querySelector(".essay");

    textarea.addEventListener("input", () => {
      grower.dataset.replicatedValue = textarea.value;
    });
  }

  // togglePause() {
  //   let pauseBtn = document.querySelector(".pause");
  //   let continueBtn = document.querySelector(".continue")

  //   pauseBtn.addEventListener("click", () => {
  //     pauseBtn.style.display = "none";
  //     continueBtn.style.display = "block";
  //     this.pauseTime();
  //   });
    
  //   continueBtn.addEventListener("click", () => {
  //     pauseBtn.style.display = "block";
  //     continueBtn.style.display = "none";
  //     this.continueTime();
  //   });
  // }

  // preventTyping() {
  //   let essayArea = document.querySelector("#essay-area");
  //   essayArea.setAttribute("contenteditable", "false");
  // }

  // resetTimer() {
  //   let countDiv = document.getElementById("timer");
    
  // }

  // checkWordCount() {
  //   let checkWordCountBtn = document.querySelector(".word-count");
    
  //   checkWordCountBtn.addEventListener('click', () => {
  //     let essayArea = document.querySelector("#essay-area");
  //     let text = essayArea.textContent;    
  //     let numWords = text.match(/(\w|')*(\w|\-)+/gi);

  //     if (!numWords) {
  //       numWords = "";
  //     }

  //     alert(numWords.length);
  //   });
  // }

  insertQuestion(question) {
    let questionContainer = document.querySelector(".white-box");

    this.removeInstructions();
    this.processTemplates();
    questionContainer.innerHTML = this.templates["question-template"]({question});
    this.createTextarea();
  }

  removeInstructions() {
    let instructions = document.querySelector(".instructions");
    let whitebox = document.querySelector(".white-box");
    // instructions.innerHTML = "";
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
        this.selectionStart =
        this.selectionEnd = start + 1;
      }
    });
  }
}