import Essay from './essay.js';
import Utilities from './utils.js';
import API from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  class App {
    constructor() {
      this.pauseBtn = document.querySelector(".pause");
      this.continueBtn = document.querySelector(".continue");
      this.finishBtns = document.querySelectorAll(".finish");
      this.newQuestionBtns = document.querySelectorAll(".new-question");
      this.essay = null;
      this.init();
    }

    init() {
      this.addEventListeners();
    }
 
    addEventListeners() {
      this.newQuestionEvent();
      this.pauseEvent();
      this.continueEvent();
      this.finishEvent();
      this.collapseMenuForSmallerScreens();
      this.toggleMenuForSmallerScreens();
      this.submitFormEvent();
    }

    submitFormEvent() {
      let form = document.querySelector("form");

      form.addEventListener("submit", (e) => {
        e.preventDefault();

        let formElements = form.elements;

        $.ajax({
          method: 'POST',
          url: 'https://formsubmit.co/ajax/513d3d9edde39122c6459bbe8407b337',
          dataType: 'json',
          accepts: 'application/json',
          data: {
              name: formElements.name.value,
              email: formElements.mail.value,
              message: formElements.msg.value,
          },
          success: () => this.showMessageConfirmationModal(),
          error: (err) => console.log(err),
        });
      });
    }

    showMessageConfirmationModal() {
      let modalMessageConfirmation = document.querySelector("#modal-message-confirmation");
      modalMessageConfirmation.style.display = "block";
      this.clearForm();
      this.closeModalWhenClicked();
    }

    clearForm() {
      let form = document.querySelector("form");
      let formElements = form.elements;

      formElements.name.value = "";
      formElements.mail.value = "";
      formElements.msg.value = "";
    }

    closeModalWhenClicked() {
      let closeBtns = document.querySelectorAll(".close-button");
      let modal = document.querySelector("#modal-message-confirmation");
  
      [...closeBtns].forEach(btn => {
        btn.addEventListener("click", () => {
          modal.style.display = "none";
        });
      });
  
      window.addEventListener("click", event => {
        if (event.target === modal) {
          modal.style.display = "none";
        }
      });
    }

    pauseEvent() {
      this.pauseBtn.addEventListener('click', (e) => {
        this.pauseBtn.style.display = "none";
        this.continueBtn.style.display = "block";

        this.essay.timer.stopTimer();
        this.disableTextArea();
      });
    }

    continueEvent() {
      this.continueBtn.addEventListener('click', (e) => {
        this.continueBtn.style.display = "none";
        this.pauseBtn.style.display = "block";
        this.essay.timer.continueTimer();
        this.enableTextArea();
      });
    }

    finishEvent() {
      [...this.finishBtns].forEach(btn => {
        btn.addEventListener("click", (e) => {
  
          let essayContent = document.querySelector(".essay").value;

          this.pauseBtn.disabled = true;
          this.continueBtn.disabled = true;
          this.disableFinishBtns();

          this.essay.timer.stopTimer();
          this.essay.countParagraphs();
          this.essay.countWordsPerParagraph();

          this.essay.api = new API(essayContent, this.essay.generateReport.bind(this.essay));
        });
      });
    }

    disableFinishBtns() {
      [...this.finishBtns].forEach(btn => {
        btn.disabled = true;
      });
    }

    disableTextArea() {
      let textarea = document.querySelector(".essay");
      textarea.disabled = true;
    }
  
    enableTextArea() {
      let textarea = document.querySelector(".essay");
      textarea.disabled = false;
    }

    showAllButtons() {
      let finishBtn = document.querySelector(".finish");
  
      this.pauseBtn.style.display = "block";
      finishBtn.style.display = "block";

      this.pauseBtn.disabled = false;
      this.continueBtn.disabled = false;
    }

    newQuestionEvent() {
      [...this.newQuestionBtns].forEach(btn => {
        btn.addEventListener("click", (e) => {
          let reportContainer = document.querySelector(".report-container");
          let mainArea = document.querySelector("main");

          if (this.currentEssayExists()) {
            let currentEssayTimerId = this.essay.timer.timerId;
            clearInterval(currentEssayTimerId);
          }

          if (reportContainer) {
            let newQuestionBtn = document.querySelector(".new-question");

            let writingAppSection = document.querySelector("#writing-app");
            writingAppSection.classList.remove("flex-2");
            writingAppSection.classList.add("center");

            reportContainer.remove();
            newQuestionBtn.classList.add("margin-right");

            mainArea.classList.remove("flex-container");
            writingAppSection.style.width = "80%";
          }

          this.showAllButtons();
          this.essay = new Essay();
          this.disableBtns();
        });
      });
    }

    disableBtns() {
      let newQuestionBtn = controls.querySelector(".new-question");
      let pauseBtn = controls.querySelector(".pause");
      let finishBtn = controls.querySelector(".finish");
      
      [newQuestionBtn, pauseBtn, finishBtn].forEach(btn => btn.disabled = true);
    }

    currentEssayExists() {
      return this.essay;
    }

    toggleMenuForSmallerScreens() {
      let menuBtn = document.querySelector("#menu-button");
      let menu = document.querySelector("#menu");
      let menuItems = menu.getElementsByTagName("li");

      menuBtn.addEventListener("click", e => {
        if (e.target.innerText === ("✕")) {
          e.target.innerText = "☰";
          menu.classList.remove("active");
        } else if (e.target.innerText === "☰") {
          e.target.innerText = "✕";
          menu.classList.add("active");
        }
      });
    }

    collapseMenuForSmallerScreens() {
      const mediaQuery = window.matchMedia('screen and (max-width: 1050px)');
      
      mediaQuery.addEventListener('change', ({ matches }) => {
        let menuBtn = document.querySelector("#menu-button");
        
        if (!matches) return;
        menuBtn.innerText = "☰";
        menu.classList.remove('active');
      });
    }
  }

  new App();
});
