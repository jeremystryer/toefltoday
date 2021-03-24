import Essay from './essay.js';
import Utilities from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  class App {
    constructor() {
      this.init();
    }

    init() {
      this.addEventListeners();
    }
 
    addEventListeners() {
      this.generateNewQuestion();
      this.modifyMenuOnResize();
      this.toggleMenuForSmallerScreens();
    }

    generateNewQuestion() {
      let newQuestionBtns = document.querySelectorAll(".new-question");
  
      [...newQuestionBtns].forEach(btn => {
        btn.addEventListener("click", (e) => {
          this.essay = new Essay();
        });
      });
    }

    modifyMenuOnResize() {
      window.addEventListener("resize", event => {
        let windowWidth = window.innerWidth;
        let menuItems = menu.getElementsByTagName("li");
        let menuBtn = document.querySelector("#menu-button");

        if (windowWidth >= 1200) {
          [...menuItems].forEach(item => item.style.display = "block");
        } else if (windowWidth <= 1200) {
          [...menuItems].forEach(item => item.style.display = "none");
          menuBtn.innerText = "☰";
        }
      });
    }

    toggleMenuForSmallerScreens() {
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
  }

  new App();
});
