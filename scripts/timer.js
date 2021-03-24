import Utilities from './utils.js';

export default class Timer {
  constructor() {
    this.init();
  }

  init() {
    this.showNewTimer();
    setTimeout(this.startTimer.bind(this), 1000);
  }

  showNewTimer() {
    let timer = document.getElementById("timer");
    timer.innerHTML = "30:00";
  }

  pauseTimer() {
    clearInterval(this.timeinterval); // stop the clock
    this.time_left = this.time_remaining(this.deadline).total; // preserve remaining time

    let textarea = document.querySelector(".essay");
    textarea.disabled = true;
  }

  continueTimer() {
    // update the deadline to preserve the amount of time remaining
    this.deadline = new Date(Date.parse(new Date()) + this.time_left);

    // start the clock
    this.runTimer('timer', this.deadline);

    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }

  time_remaining(endtime) {
    let totalTime = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor( (totalTime/1000) % 60 );
    let minutes = Math.floor( (totalTime/1000/60) % 60 );

    return {'total': totalTime, 'minutes': minutes, 'seconds': seconds};
  }

  startTimer() {
    let time_in_minutes = 0.25;
    let current_time = Date.parse(new Date());
    let pauseBtn = document.querySelector(".pause");
    
    this.deadline = new Date(current_time + time_in_minutes * 60 * 1000);
    this.currentTimer = true;

    pauseBtn.disabled = false;
    this.runTimer('timer', this.deadline);

    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }
  
  showTimeEndedModal() {
    let modal = document.querySelector("#modal-time-ended");
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

  runTimer(id, endtime) {
    let timer = document.getElementById(id);
    let pauseBtn = document.querySelector(".pause");
    let essay = document.querySelector(".essay");

    const updateTime = () => {
      let totalTime = this.time_remaining(endtime);
      timer.innerHTML = `${Utilities.padDigits(totalTime.minutes)}:${Utilities.padDigits(totalTime.seconds)}`;

      if (totalTime.total <= 0) { 
        clearInterval(this.timeinterval); 
        pauseBtn.disabled = true;
        essay.disabled = true;

        this.showTimeEndedModal();
      }
    }

    updateTime(); // run function once at first to avoid delay
    this.timeinterval = setInterval(updateTime, 1000);
  }
}