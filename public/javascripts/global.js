// ----- General Functions -----

var MAX_DATAPOINTS = 20;
var energyTemp = 0;

var electricStats = {
    voltage: [],
    current: [],
    power: [],
    energy: []
};

// ----- Socket.io Code -----

// Define socket which automatically uses the connected server
var socket = io();

socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
});

// socket.on('messages', function(data) {
//     console.log('Received messages: ' + data);
// });

socket.on('stats', function(data) {
    var parsedData = JSON.parse(data);
    console.log('Received stats: ');
    console.log(parsedData);
    pushStats(electricStats, 'power', parsedData);
});

function pushStats(statObj, statType, data) {
    console.log('Pushing ' + statType + ' to ' + statObj);
    try {
        statObj[statType].push(data[statType]);
    } catch (error) {
        console.log('Error adding ' + statType + ' to ' + statObj);
        console.log(error);
    }
}