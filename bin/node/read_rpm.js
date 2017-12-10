var rpio = require('rpio');

var startTime, endTime, period, rps, rpm;
var count = 0;
var initial = true;
var pinNum = 12;

rpio.open(pinNum, rpio.INPUT, rpio.PULL_HIGH);

function poll_lowcb(pin) {
    if (initial) {
	console.log('Entered initial phase');
        initial = false;
        startTime = process.hrtime();
        return;
    }
    console.log('Getting times...');
    endTime = process.hrtime(startTime);
    startTime = process.hrtime();
    period = endTime[0] + endTime[1]/1000000000;
    rps = 1/period;
    rpm = rps*60;
    count++;
    console.log('Stats for pulse %d:', count);
    console.log('%ds', period);
    console.log('%dRPS', rps);
    console.log('%dRPM', rpm);
}

console.log('Reading pin %d', pinNum); 
rpio.poll(pinNum, poll_lowcb, rpio.POLL_LOW);
