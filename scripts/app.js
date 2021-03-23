import Essay from './essay.js';
import Utilities from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  class App {
    constructor() {
      this.init();
    }

    init() {
      this.addEventListeners();
      this.callApi();
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

    callApi() {
      // const data = "text=Susan%20go%20to%20the%20store%20everyday&language=en-US";

      // const xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;
      
      // xhr.addEventListener("readystatechange", function () {
      //   if (this.readyState === this.DONE) {
      //     console.log(this.responseText);
      //   }
      // });
      
      // xhr.open("POST", "https://grammarbot.p.rapidapi.com/check");
      // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      // xhr.setRequestHeader("x-rapidapi-key", "4a434644b7mshf0c157810805032p180f52jsn6f7ab924b303");
      // xhr.setRequestHeader("x-rapidapi-host", "grammarbot.p.rapidapi.com");
      
      // xhr.send(data);
    }
  }

  new App();
});
