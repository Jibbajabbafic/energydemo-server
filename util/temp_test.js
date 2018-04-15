var TARGET_TEMP = 100;
var mass = 0.3;
var heat_capacity = 4190;
var sensor = require('ds18x20');
var SAMPLE_TIME = 1;

// ======== ensure the following shell code has run before starting: ========
// sudo modprobe w1-gpio && sudo modprobe w1-therm

var power = 1;

sensor.isDriverLoaded(function (err, isLoaded) {
    console.log("Driver loaded: " + isLoaded);
});

sensor.list(function (err, listOfDeviceIds) {
    var probes = listOfDeviceIds;
    var probe_kettle = probes[0];
    var probe_ambient = probes[1];
    console.log(listOfDeviceIds);

    intervalID = setInterval( () => {
        sensor.getAll(function (err, tempObj) {
            // console.log(tempObj);

            var temp_kettle = tempObj[probe_kettle];
            var temp_ambient = tempObj[probe_ambient];

            var energy = heat_capacity*mass*(TARGET_TEMP - temp_kettle)
            var time = Math.round(energy / power);
            var timeStr = fancyTimeFormat(time);    
            console.log("\n\n\n\n\n\n\n\n\n\n\n\n");
            console.log("===================================================");
            console.log("Probes: ");
            console.log("Ambient = " + probe_ambient);
            console.log("Kettle = " + probe_kettle);
            console.log("Mass of Water: " + mass + " kg");
            console.log("Target Temperature: " + TARGET_TEMP + " degrees C");            
            console.log("Ambient Temperature: " + temp_ambient + " degrees C");
            console.log("Kettle Temperature: " + temp_kettle + " degrees C");                
            console.log("Power Input: " + power + " Watts");
            console.log("Estimated time is: " + time + " seconds, " + timeStr);
            console.log("===================================================");            
        });
    }, SAMPLE_TIME * 1000);
});

// sensor.get('28-00000574c791', function (err, temp) {
//     console.log(temp);
//     var energy = heat_capacity*mass*(TARGET_TEMP - temp)
//     var time = energy / power;
//     console.log("Estimated time is: " + time);
// });

function fancyTimeFormat(time)
{   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + " hrs " + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + " mins " + (secs < 10 ? "0" : "");
    ret += "" + secs + "s ";
    return ret;
}