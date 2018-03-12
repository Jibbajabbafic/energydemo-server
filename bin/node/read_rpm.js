var rpio = require('rpio');

// How long to wait between readings before outputting zero
var TIMEOUT_DELAY = 2000;

module.exports = function (pinNum) {
    this.pinNum = pinNum;
    this.rpm = 0;
    this.count = 0;

    this.initial = true;
    this.startTime;
    this.endTime;
    this.period;

    this.getRPM = function () {
        return this.rpm;
    }

    // Need to define parent in order to have access to it within callbacks
    var parent = this;

    rpio.open(this.pinNum, rpio.INPUT, rpio.PULL_HIGH);

    rpio.poll(this.pinNum, function() {
        if (parent.initial) {
            // Check if first reading (need at least two for RPM)
            parent.initial = false;
            parent.startTime = process.hrtime();
        }
        else {
            // Reset the timeout
            clearTimeout(parent.timeout);

            // Find time between readings to calculate RPM
            parent.endTime = process.hrtime(parent.startTime);
            parent.startTime = process.hrtime();
            parent.period = parent.endTime[0] + parent.endTime[1]/1000000000;

            parent.rpm = 60/parent.period;
            parent.count++;

	        // console.log('Stats for pulse %d:', parent.count);
            // console.log('%ds', parent.period);
            // console.log('%dRPM', parent.rpm);

            parent.timeout = setTimeout(function() {
                // If timeout reached reset to initial state and set reading to zero
                parent.initial = true;
                parent.rpm = 0;
            }, TIMEOUT_DELAY);
        }
    }, rpio.POLL_LOW);
}