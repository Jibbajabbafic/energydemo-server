var rpio = require('rpio');

var pinNum = 11;

rpio.open(pinNum, rpio.OUTPUT, rpio.HIGH);

function rpmToPeriod(rpm) {
    var rps = rpm/60;
    var period = 1/rps;
    return period;
}

var rpmInput = 60;
var periodInput = rpmToPeriod(rpmInput);
var pulseNum = 30;
var offsetTime = 0;

console.log('Generating %dRPM with period %ds for %d pulses', rpmInput, periodInput, pulseNum);

for (var i = 0; i < pulseNum; i++) {
    start = process.hrtime();
    rpio.write(pinNum, rpio.LOW);
    rpio.msleep(10);

    rpio.write(pinNum, rpio.HIGH);
    end = process.hrtime(start);
    endS = end[0] + end[1]/1000000000;
    offsetTime = periodInput - endS;
    rpio.sleep(offsetTime);
}