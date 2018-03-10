var rpio = require('rpio');

module.exports = function (pinNum) {
    this.pinNum = pinNum;
    this.rpm = 0;
    this.count = 0;

    this.initial = true;
    this.startTime;
    this.endTime;
    this.period;

    var parent = this;

    rpio.open(this.pinNum, rpio.INPUT, rpio.PULL_HIGH);

    rpio.poll(this.pinNum, function() {
        if (parent.initial) {
            console.log('Entered initial phase for pin ' + parent.pinNum);
            parent.initial = false;
            parent.startTime = process.hrtime();
        }
        else {
            console.log('Getting RPM for pin ' + parent.pinNum);
            parent.endTime = process.hrtime(parent.startTime);
            parent.startTime = process.hrtime();
            parent.period = parent.endTime[0] + parent.endTime[1]/1000000000;

            parent.rpm = 60/parent.period;
            parent.count++;

	    console.log('Stats for pulse %d:', parent.count);
            console.log('%ds', parent.period);

            console.log('%dRPM', parent.rpm);
        }
    }, rpio.POLL_LOW);
}