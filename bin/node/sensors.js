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
    RPMsensor = require('./read_rpm.js'); // Read pins from hall sensors
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
        shunt_ohms: 0.01,
        rpmSensor: new RPMsensor(16)
    },
    {
        name: "handcrank",
        address: 0x41,
        shunt_ohms: 0.1,
        rpmSensor: new RPMsensor(18)
    }
];

// Function to read collection of sensors and send a packet of data
function readSensor(sensorObj, callback) {
    let statPacket = [];

    PythonShell.run(pythonScript, {args: [sensorObj.address, sensorObj.shunt_ohms] }, function (err, data) {
        // Check if script returned an error
        if (err) callback(err);

        // Put together the packet of data
        statPacket = data[0];
        statPacket.rpm = sensorObj.rpmSensor.getRPM();
        statPacket.name = sensorObj.name;

        // Emit the data to all clients
        // socketObj.emit('stats', statPacket);
        callback(null, statPacket);
    });
}

module.exports.readAll = function (callback) {
    for (var i = 0; i < sensorList.length; i++) {
        // Loop through all sensors in sensor list and emit stats for them
        readSensor(sensorList[i], callback);
    };
};
