var rpio = require('rpio');

// Export object for multiple sensors
module.exports = function (pinNum) {
    this.startTime;
    this.endTime;
    this.period;
    this.rps;
    this.count = 0;
    this.initial = true;
    this.pinNum = pinNum;
    this.rpm = 0;

// Function to be called when input goes low
    this.poll_lowcb = function() {
        if (this.initial) {
        console.log('Entered initial phase');
            this.initial = false;
            this.startTime = process.hrtime();
            return;
        }
        console.log('Getting times...');
        this.endTime = process.hrtime(this.startTime);
        this.startTime = process.hrtime();
        this.period = this.endTime[0] + this.endTime[1]/1000000000;
        this.rps = 1/this.period;
        this.rpm = this.rps*60;
        this.count++;
        console.log('Stats for pulse %d:', this.count);
        console.log('%ds', this.period);
        console.log('%dRPS', this.rps);
        console.log('%dRPM', this.rpm);
    }

    this.getRPM = function () {
        return this.rpm;
    }

    // Open pin for reading
    rpio.open(this.pinNum, rpio.INPUT, rpio.PULL_HIGH);

    //Poll pin and execute callback
    rpio.poll(this.pinNum, this.poll_lowcb, rpio.POLL_LOW);
}

// var startTime, endTime, period, rps;
// var rpm = 0;
// var count = 0;
// var initial = true;
// var pinNum = 12;

// rpio.open(pinNum, rpio.INPUT, rpio.PULL_HIGH);

// // Function to be called when input goes low
// function poll_lowcb(pin) {
//     if (initial) {
// 	console.log('Entered initial phase');
//         initial = false;
//         startTime = process.hrtime();
//         return;
//     }
//     console.log('Getting times...');
//     endTime = process.hrtime(startTime);
//     startTime = process.hrtime();
//     period = endTime[0] + endTime[1]/1000000000;
//     rps = 1/period;
//     rpm = rps*60;
//     count++;
//     console.log('Stats for pulse %d:', count);
//     console.log('%ds', period);
//     console.log('%dRPS', rps);
//     console.log('%dRPM', rpm);
// }

// function getRPM() {
//     return rpm;
// }

// console.log('Reading pin %d', pinNum); 
// rpio.poll(pinNum, poll_lowcb, rpio.POLL_LOW);
