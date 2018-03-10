var rpio = require('rpio');

var TIMEOUT_DELAY = 2000;

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
            // console.log('Entered initial phase for pin ' + parent.pinNum);
            parent.initial = false;
            parent.startTime = process.hrtime();
        }
        else {
	    clearTimeout(parent.timeout);
            // console.log('Getting RPM for pin ' + parent.pinNum);
            parent.endTime = process.hrtime(parent.startTime);
            parent.startTime = process.hrtime();
            parent.period = parent.endTime[0] + parent.endTime[1]/1000000000;

            parent.rpm = 60/parent.period;
            parent.count++;

	    // console.log('Stats for pulse %d:', parent.count);
            // console.log('%ds', parent.period);

            // console.log('%dRPM', parent.rpm);
	    parent.timeout = setTimeout(function() {
		parent.initial = true;
		parent.rpm = 0;
            }, TIMEOUT_DELAY);
        }
    }, rpio.POLL_LOW);
}