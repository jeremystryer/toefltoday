export default class Timer {
  constructor() {
    this.init();
  }

  init() {
    this.showPauseButton();
    this.showNewTimer();
    this.addEventListeners();
    setTimeout(this.runTimer.bind(this), 1000);
  }

  showNewTimer() {
    let timer = document.getElementById("timer");
    timer.innerHTML = "30:00";
  }

  showPauseButton() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");

    pauseBtn.style.display = "block";
    continueBtn.style.display = "none";
  }

  runTimer() {
    let time_in_minutes = 30;
    let current_time = Date.parse(new Date());
    let pauseBtn = document.querySelector(".pause");
    
    this.deadline = new Date(current_time + time_in_minutes * 60 * 1000);
    this.currentTimer = true;

    pauseBtn.disabled = false;
    this.run_clock('timer', this.deadline);

    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }

  addEventListeners() {
    let pauseBtn = document.querySelector(".pause");
    let continueBtn = document.querySelector(".continue");
    let newQuestionBtn = document.querySelector(".new-question");

    pauseBtn.addEventListener('click', (e) => {
      this.toggleTimeButton(e.target);
      this.pauseTimer();
    });

    continueBtn.addEventListener('click', (e) => {
      this.toggleTimeButton(e.target);
      this.continueTimer();
    });

    newQuestionBtn.addEventListener("click", () => {
      clearInterval(this.timeinterval);
    });
  }

  toggleTimeButton(option) {
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
    this.run_clock('timer', this.deadline);

    let textarea = document.querySelector(".essay");
    textarea.disabled = false;
  }

  time_remaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    // var hours = Math.floor( (t/(1000*60*60)) % 24 );
    // var days = Math.floor( t/(1000*60*60*24) );
    return {'total':t, 'minutes':minutes, 'seconds':seconds};
  }

  padDigits(n) {
    return (n < 10 ? "0" : "") + n;
  }
  
  run_clock(id, endtime) {
    let timer = document.getElementById(id);
    const update_clock = () => {
      var t = this.time_remaining(endtime);
      timer.innerHTML = `${this.padDigits(t.minutes)}:${this.padDigits(t.seconds)}`;
      if (t.total <= 0){ clearInterval(this.timeinterval); }
    }

    update_clock(); // run function once at first to avoid delay
    
    this.timeinterval = setInterval(update_clock, 1000);
  }
}
