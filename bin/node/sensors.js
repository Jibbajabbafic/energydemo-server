// Module to execute python scripts
var PythonShell = require('python-shell');

// Set up default options
PythonShell.defaultOptions = { 
    mode: 'json',
    // pythonPath: '/usr/bin/python3',
    scriptPath: './bin/python'
};

// Module for reading RPM sensors
var RPMsensor = require('./random_rpm.js'); // Read random RPM data
// var RPMsensor = require('./read_rpm.js'); // Read pins from hall sensors

// List of all sensors with i2c address and rpmSensor pinNumbers
var sensorList = [
    {
        name: "bike",
        address: 0x40,
        rpmSensor: new RPMsensor(11)
    },
    {
        name: "handcrank",
        address: 0x41,
        rpmSensor: new RPMsensor(12)
    }
];

function readSensor(sensorObj, socketObj) {
    statPacket = [];
    // console.log("calling py with address " + sensorObj.address);
    PythonShell.run("read_ina.py", {args: sensorObj.address}, function (err, data) {
        if (err) return err;
	// console.log("calling py with address " + sensorObj.address);
        statPacket = data[0];
        statPacket.rpm = sensorObj.rpmSensor.getRPM();
        statPacket.name = sensorObj.name;
        socketObj.emit('stats', statPacket);
        return statPacket;
    });
}

module.exports.readAll = function (socketObj) {
    for (var i = 0; i < sensorList.length; i++) {
        readSensor(sensorList[i], socketObj);
    };
};
