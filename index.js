document.addEventListener('DOMContentLoaded', () => {
  class App {
    constructor() {
      this.init();
    }

    init() {
      this.addEventListeners();
    }
 
    addEventListeners() {
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("new-question") || e.target.parentElement.classList.contains("new-question")) {
          this.essay = new Essay();
        }
      });

      this.closeMenu();
    }

    closeMenu() {
      let menuBtn = document.querySelector("#menu-button");
      let menuItems = menu.getElementsByTagName("li");
      
      menuBtn.addEventListener("click", e => {
        if (e.target.innerText === ("✕")) {
          e.target.innerText = "☰";
          [...menuItems].forEach(item => item.style.display = "none");
        } else if (e.target.innerText === "☰") {
          e.target.innerText = "✕";
          [...menuItems].forEach(item => item.style.display = "block");
        }
      });
    }

    showTimeEndedModal() {
      let modalReview = document.querySelector("#modal-review");
      let reviewBtn = document.querySelector("#review-button");
      modalReview.style.display = "block";
      // this.essay.preventTyping();
      
      reviewBtn.addEventListener("click", () => {
        let essayArea = document.querySelector("#essay-area");
        let text = essayArea.textContent;

        fetch("https://grammarbot.p.rapidapi.com/check", {
          "method": "POST",
          "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "x-rapidapi-key": "4a434644b7mshf0c157810805032p180f52jsn6f7ab924b303",
            "x-rapidapi-host": "grammarbot.p.rapidapi.com",
          },
          body: new URLSearchParams({
            text: text,
          }),
        })
        .then(response => {
          return response.json();
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.error(err);
        });
      });
    }
  }

  class Essay {
    constructor() {
      this.init();
    }

    init() {
      this.selectQuestion();
      // setTimeout(this.startTimer.bind(this), 1000);
      this.startTimer();
      // this.setTab();
      this.addEventListeners();
    }

    createTextarea() {
      let textarea = document.createElement("textarea");
      let growWrapDiv = document.createElement("div");
      let whitebox = document.querySelector(".white-box")
   
      growWrapDiv.classList.add("grow-wrap", "dont-break-out");
      textarea.classList.add("essay");
   
      textarea.placeholder = "Write your essay here...";

      whitebox.insertAdjacentElement("beforeend", growWrapDiv);
      
      growWrapDiv.insertAdjacentElement("beforeend", textarea);
      
      this.autoChangeTextarea();
      this.setTab();
    }

    startTimer() {     
      // let seconds = 1800;
      // let countDiv = document.getElementById("timer");

      // this.createTextarea();
      // const countDown = setInterval(() => {
      //                   secondsPass();
      //                 }, 1000);
      
      // const secondsPass = () => {
      //   let min = Math.floor(seconds / 60);
      //   let remainingSeconds = seconds % 60;
        
      //   if (remainingSeconds < 10) {
      //     remainingSeconds = '0' + remainingSeconds;
      //   }

      //   if (min < 10) {
      //     min = '0' + min;
      //   }

      // countDiv.innerHTML = min + ":" + remainingSeconds;
        
      //   if (seconds > 0) {
      //     seconds = seconds - 1;
      //   } else {
      //     clearInterval(countDown);
      //     this.showTimeEndedModal();
      //   }
      // }
    }

    addEventListeners() {
      // this.autoChangeTextarea();
    }

    autoChangeTextarea() {
      const grower = document.querySelector(".grow-wrap");
      const textarea = grower.querySelector(".essay");

      textarea.addEventListener("input", () => {
        grower.dataset.replicatedValue = textarea.value;
      });
    }

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

  class Utilities {
    static getRandom(questions) {
      let index = Math.floor(Math.random() * questions.length);
      return questions[index];
    }
  }

  new App();
});