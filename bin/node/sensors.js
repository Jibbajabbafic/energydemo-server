var USE_RANDOM_DATA = false;

var pythonScript;
var RPMsensor;

if (USE_RANDOM_DATA) {
    // Load appropriate scripts for generating ranodm data

    // Script for random electrical data
    pythonScript = "read_random.py";
    
    // Module for reading RPM sensors
    RPMsensor = require('./random_rpm.js'); // Read random RPM data
}
else {
    // Load appropriate scripts to read sensors

    // Script for reading INA219 sensors
    pythonScript = "read_ina.py";
    
    // Module for reading RPM sensors
    RPMsensor = require('./improved_read.js'); // Read pins from hall sensors
}

// Module to execute python scripts
var PythonShell = require('python-shell');

// Set up default options
PythonShell.defaultOptions = { 
    mode: 'json',
    // pythonPath: '/usr/bin/python3',
    scriptPath: './bin/python'
};

// List of all sensors with i2c address and rpmSensor pinNumbers
var sensorList = [
    {
        name: "bike",
        address: 0x40,
        rpmSensor: new RPMsensor(37)
    },
    {
        name: "handcrank",
        address: 0x41,
        rpmSensor: new RPMsensor(38)
    }
];

function readSensor(sensorObj, socketObj) {
    statPacket = [];
    // console.log("calling py with address " + sensorObj.address);
    PythonShell.run(pythonScript, {args: sensorObj.address}, function (err, data) {
        if (err) return err;
	// console.log("calling py with address " + sensorObj.address);
        statPacket = data[0];
        statPacket.rpm = sensorObj.rpmSensor.rpm;
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
