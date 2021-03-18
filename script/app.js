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
      // this.togglePause();
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

  //   showTimeEndedModal() {
  //     let modalReview = document.querySelector("#modal-review");
  //     let reviewBtn = document.querySelector("#review-button");
  //     modalReview.style.display = "block";
  //     // this.essay.preventTyping();
      
  //     reviewBtn.addEventListener("click", () => {
  //       let essayArea = document.querySelector("#essay-area");
  //       let text = essayArea.textContent;

  //       fetch("https://grammarbot.p.rapidapi.com/check", {
  //         "method": "POST",
  //         "headers": {
  //           "content-type": "application/x-www-form-urlencoded",
  //           "x-rapidapi-key": "4a434644b7mshf0c157810805032p180f52jsn6f7ab924b303",
  //           "x-rapidapi-host": "grammarbot.p.rapidapi.com",
  //         },
  //         body: new URLSearchParams({
  //           text: text,
  //         }),
  //       })
  //       .then(response => {
  //         return response.json();
  //       })
  //       .then(response => {
  //         console.log(response);
  //       })
  //       .catch(err => {
  //         console.error(err);
  //       });
  //     });
  //   }
  // }