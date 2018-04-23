#!/usr/bin/env node

/**
 * Port to host server on
 */
var PORT = 3000;

/**
 * Time between samples in seconds (will lag a lot if set too low!)
 */
var SAMPLE_TIME = 1;

/**
 * When true, stops readings if no clients connected
 */
var ONLY_READ_WHEN_CLIENTS_CONNECTED = false;

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('energydemo-server:server');
var http = require('http');

/**
 *  Module with all sensor information
 */
var sensors = require('./node/sensors.js');

/**
 * Relay module to control raspberry pi pins
 */
const Relay = require('./node/relay.js');

var relay = new Relay();

/**
 * Temperature module to read temperature sensors
 */

const Temperature = require('./node/temperature.js');

var temperature = new Temperature();

/**
 * Function to be called when reading sensors
 */
function readSensors() {
    // Read all sensors and emit using io object
    // console.log("Calling readSensors()");
    sensors.readAll( (err, data) => {
        if (err) return err;
        // console.log(data);
        io.emit('stats', data);
    });

    temperature.readAll( (err, temp_kettle, temp_ambient, energy) => {
        if(err) return err;

        // console.log("Temp kettle: ", temp_kettle);
        // console.log("Temp ambient: ", temp_ambient);
        // console.log("Energy: ", energy);

        let tempPacket = {
            amount: temperature.mass,
            target: temperature.target_temp,
            kettle: temp_kettle,
            ambient: temp_ambient,
            energy: energy
        };

        io.emit('temps', tempPacket);
    });

    // let tempPacket = {
    //     amount: 0.3,
    //     target: 100,
    //     kettle: 73.3,
    //     ambient: 22.8,
    //     energy: 900036.1
    // };
    // io.emit('temps', tempPacket);    

};

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Setup socket.io and define all functionality
 */

var io = require('socket.io').listen(server);

var readSensorFlag = 0;
var clientCount = 0;

var relayState = {
    lights: null,
    kettle: null,
    charger: null
};

io.on('connection', function (client) {
    // Keep track of connected clients
    console.log('Client connected');
    clientCount++;
    console.log('Connected clients: ' + clientCount);
    
    // Tell the user the status of the sensor script
    io.emit('toggleStatus', readSensorFlag);

    // Tell the user the status of the relays
    io.emit('relayStatus', relayState);

    client.on('disconnect', function () {
        console.log('Client disconnected');
        if (clientCount > 0) clientCount--;
        console.log('Connected clients: ' + clientCount);
        // Optional code to stop readings when no clients connected
        if (ONLY_READ_WHEN_CLIENTS_CONNECTED) {
            if (clientCount == 0 && readSensorFlag) {
                console.log('No clients connected, stopping readings...')
                clearInterval(intervalID);
                readSensorFlag = 0;
            };
        };
    });

    client.on('toggle', function () {
        if (readSensorFlag) {
            console.log('Stopping readings...')
            clearInterval(intervalID);
            readSensorFlag = 0;
        } else {
            console.log('Starting readings...')
            intervalID = setInterval( function() {
                // Function to call 
                readSensors();

            }, SAMPLE_TIME * 1000);
            readSensorFlag = 1;
        }
        io.emit('toggleStatus', readSensorFlag);
    });

     client.on('relaySwitch', function (data) {
         // console.log(data);


         if (relayState[data.output] == data.input) {
             relayState[data.output] = null;
         }
         else {
             relayState[data.output] = data.input;
             // relay.connect(data.input, data.output);
         }
        
         relay.disableAll();
         relay.setAll(relayState);

         io.emit('relayStatus', relayState);
     });    
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Output link to site for convenience
 */

console.log('Server started on: http://localhost:' + port)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
}