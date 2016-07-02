'use strict';

class Timer {
  constructor(interval, onUpdate) {
    this.intervalId = null;
    this.time = 0;
    this.interval = interval;
    this.onUpdate = onUpdate;
  }

  start() {
    console.log('START TIMER', this.interval, this.onUpdate);
    let previous = Date.now();

    this.intervalId = setInterval(() => {
        const currentTime = Date.now();
        const delta = (currentTime - previous) / 1000;

        // console.log('Delta: ' + delta);

        previous = currentTime;

        if (typeof this.onUpdate === 'function') {
            this.onUpdate(delta);
        }

        this.time += delta;
    }, this.interval);
  }

  stop() {
      clearInterval(this.intervalId);
      this.time = 0;
  }

  getTime() {
      return this.time;
  }

  setTime(value) {
      this.time = value;
  }
}

module.exports = Timer;