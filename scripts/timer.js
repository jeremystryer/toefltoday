import Utilities from './utils.js';

export default class Timer {
  constructor() {
    this.init();
  }

  init() {
    this.showNewTimer();
    setTimeout(this.launchTimer.bind(this), 5000);
  }

  launchTimer() {
    this.setTimerProperties();
    this.enableBtns();
    this.runTimer();
  }

  enableBtns() {
    let newQuestionBtn = controls.querySelector(".new-question");
    let pauseBtn = controls.querySelector(".pause");
    let finishBtn = controls.querySelector(".finish");
    
    [newQuestionBtn, pauseBtn, finishBtn].forEach(btn => btn.disabled = false);
  }

  setTimerProperties() {
    this.timeRemainingRecord = null;
    this.timeElapsedRecord = null;
    this.timeLimitInMinutes = 30;
    this.startTime = Date.parse(new Date());
    this.deadline = new Date(this.startTime + 
      this.convertMinutesToMilliseconds(this.timeLimitInMinutes));
  }

  convertMinutesToMilliseconds(minutes) {
    const SECONDS_MULTIPLIER = 60;
    const MILLISECONDS_MULTIPLIER = 1000;
    return minutes * SECONDS_MULTIPLIER * MILLISECONDS_MULTIPLIER;
  }

  showNewTimer() {
    let timer = document.getElementById("timer");
    timer.innerHTML = "30:00";
  }

  stopTimer() {
    clearInterval(this.timerId);
  }

  continueTimer() {
    this.deadline = new Date(Date.parse(new Date()) + this.timeRemainingRecord.total);
    this.runTimer();
  }

  runTimer() {
    let pauseBtn = document.querySelector(".pause");
    let essay = document.querySelector(".essay");

    const updateTime = () => {
      this.setTimeRemainingRecord();
      this.setTimeElapsedRecord();
      this.showTime();
      this.enableTextArea();

      if (this.timeEnded()) { 
        clearInterval(this.timerId); 
        pauseBtn.disabled = true;
        essay.disabled = true;

        this.showTimeEndedModal() 
      }
    }

    updateTime();
    this.timerId = setInterval(updateTime, 1000);
  }

  timeEnded() {
    return this.timeRemainingRecord.total <= 0;
  }
    
  showTime() {
    let timerSpan = document.getElementById("timer");
    timerSpan.innerHTML = `${Utilities.padDigits(this.timeRemainingRecord.minutes)}:${Utilities.padDigits(this.timeRemainingRecord.seconds)}`;
  }

  getTotalTimeRemaining() {
    return Date.parse(this.deadline) - Date.parse(new Date());
  }

  setTimeRemainingRecord() {
    let totalTimeRemaining = this.getTotalTimeRemaining();
    
    let secondsRemaining = Math.floor( (totalTimeRemaining/1000) % 60 );
    let minutesRemaining = Math.floor( (totalTimeRemaining/1000/60) % 60 );
    this.timeRemainingRecord = {'total': totalTimeRemaining, 'minutes': minutesRemaining, 'seconds': secondsRemaining};

    return this.timeRemainingRecord;
  }

  setTimeElapsedRecord() {
    let totalTimeElapsed = this.convertMinutesToMilliseconds(this.timeLimitInMinutes) - this.timeRemainingRecord.total;
    let secondsElapsed = Math.floor( (totalTimeElapsed/1000) % 60 );
    let minutesElapsed = Math.floor( (totalTimeElapsed/1000/60) % 60 );
    this.timeElapsedRecord = {'total': totalTimeElapsed, 'minutes': minutesElapsed, 'seconds': secondsElapsed};

    return this.timeElapsedRecord;
  }

  showElapsedTime() {
    return `${Utilities.padDigits(this.timeElapsedRecord.minutes)}:${Utilities.padDigits(this.timeElapsedRecord.seconds)}`;
  }
  
  showTimeEndedModal() {
    let modal = document.querySelector("#modal-time-ended");
    modal.style.display = "block";
    this.closeModalWhenClicked();
  }

  closeModalWhenClicked() {
    let closeBtns = document.querySelectorAll(".close-button");
    let modal = document.querySelector("#modal-time-ended");

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

  enableTextArea() {
    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }
}
