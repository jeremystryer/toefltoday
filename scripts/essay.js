import Utilities from './utils.js';
import runTimer from './timer.js';
import Timer from './timer.js';
import API from './api.js'

export default class Essay {
  constructor() {
    this.wordCount = 0;
    this.init();
  }

  init() {
    this.selectQuestion();
    this.startEssay();
    this.showPauseButton();
    this.enableFinishButton();
    this.timer = new Timer();
    this.addEventListeners();
  }

  enableFinishButton() {
    let finishBtns = document.querySelectorAll(".finish");
  
    [...finishBtns].forEach(btn => {
      btn.disabled = false;
    });
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

  showPauseButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "block";
    continueBtn.style.display = "none";
  }

  showContinueButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "none";
    continueBtn.style.display = "block";
  }
  
  addEventListeners() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");
    let newQuestionBtn = document.querySelector(".new-question");
    let finishBtn = document.querySelector(".finish")

    pauseBtn.addEventListener('click', (e) => {
      this.togglePauseContinueButton(e.target);
      this.timer.pauseTimer();
    });

    continueBtn.addEventListener('click', (e) => {
      this.togglePauseContinueButton(e.target);
      this.timer.continueTimer();
    });

    newQuestionBtn.addEventListener("click", () => {
      clearInterval(this.timer.timeinterval);
    });

    let finishBtns = document.querySelectorAll(".finish");
  
    [...finishBtns].forEach(btn => {
      let pauseBtn = document.querySelector(".pause");
      let continueBtn = document.querySelector(".continue");

      btn.addEventListener("click", (e) => {
        let essayContent = document.querySelector(".essay").value;
        let timer = document.getElementById("timer");

        this.timer.pauseTimer();
        
        if (this.wordCount < 150) {
          this.showNotEnoughWordsModal();

          if (timer.innerText === "00:00") {
            let modalTimeEnded = document.querySelector("#modal-time-ended");
            modalTimeEnded.style.display = "none";
            pauseBtn.disabled = true;
          } else {
            this.showContinueButton();
          }

          return;
        }

        pauseBtn.disabled = true;
        continueBtn.disabled = true;
        this.api = new API(essayContent);
      });
    });
  }

  showNotEnoughWordsModal() {
    let modal = document.querySelector("#modal-not-enough-words");
    let closeBtns = document.querySelectorAll(".close-button");

    [...closeBtns].forEach(btn => {
      btn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    });

    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    }

    modal.style.display = "block";
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

    whitebox.insertAdjacentElement("beforeend", growWrapDiv);
    growWrapDiv.insertAdjacentElement("beforeend", textarea);
    this.createWordCounter();
    this.trackWordCount();
    this.autoChangeTextarea();
    this.setTab();
  }

  startEssay() {
    let timerBox = document.querySelector("#timer-box");
    let pauseBtn = document.querySelector(".pause");

    // this.createTextarea();
    timerBox.style.display = "block";
  }

  createWordCounter() {
    let wordCountDiv = document.createElement("div");
    let whitebox = document.querySelector(".white-box")

    whitebox.insertAdjacentElement("beforeend", wordCountDiv);
    wordCountDiv.classList.add("word-count");
    wordCountDiv.innerText = "0 words"
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
    questionContainer.innerHTML = this.templates["question-template"]({question});
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
        this.selectionStart =
        this.selectionEnd = start + 1;
      }
    });
  }
}