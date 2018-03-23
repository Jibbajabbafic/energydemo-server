var TARGET_TEMP = 100;
var mass = 300;
var heat_capacity = 4190;
var sensor = require('ds18x20');

var power = 100;

sensor.isDriverLoaded(function (err, isLoaded) {
    console.log("Sensor load status: " + isLoaded);
});

sensor.list(function (err, listOfDeviceIds) {
    console.log(listOfDeviceIds);
});

sensor.get('28-00000574c791', function (err, temp) {
    console.log(temp);
    var energy = heat_capacity*mass*(TARGET_TEMP - temp)
    var time = energy / power;
    console.log("Estimated time is: " + time);
});