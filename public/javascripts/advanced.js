// ----- General Functions -----

var MAX_DATAPOINTS = 20;
var energyTemp = 0;

// Array to hold our data
var electricStats = {
    voltageArry: [],
    currentArry: [],
    powerArry: [],
    energyArry: []
};

var updateHolders = function(){};

// ----- Socket.io Code -----
// Define socket which automatically uses the connected server
var socket = io();

// Define what to do when stats are received
socket.on('stats', function(data) {
    // var parsedData = JSON.parse(data);
    console.log('Received stats: ');
    console.log(data);
    // pushStats(electricStats, 'power', parsedData);
    updateHolders(data, electricStats);
});

// Code to update button colour based on if reading sensor
socket.on('toggleStatus', function(data){
    if (data) {
        $('#toggleRead').css('background-color', '#90e79e');
    } else {
        $('#toggleRead').css('background-color', '#e79090');
    }
});

// ----- jQuery Functions -----
$(document).ready( function() {
    $('#toggleRead').on('click', function(){
        console.log('TOGGLING');
        socket.emit('toggle', '');
    });
    // ----- CanvasJS stuff -----

    // Create new charts to hold our data
    var chart1 = new CanvasJS.Chart("chartContainer1", {
        title: {
            text: "Power Output"
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Power (W)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: electricStats.powerArry
        }]
    });

    var chart2 = new CanvasJS.Chart("chartContainer2", {
        title: {
            text: "Voltage Output"
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Voltage (V)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: electricStats.voltageArry
        }]
    });

    var chart3 = new CanvasJS.Chart("chartContainer3", {
        title: {
            text: "Current Output"
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Current (A)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: electricStats.currentArry
        }]
    });

    var chart4 = new CanvasJS.Chart("chartContainer4", {
        title: {
            text: "Cumulative Energy"
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Energy (J)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: electricStats.energyArry
        }]
    });

    var renderAllCharts = function() {
        chart1.render();
        chart2.render();
        chart3.render();
        chart4.render();
    }

    var updateStatArry = function(statObj, statArry, xVal, yVal) {
        if (isNaN(yVal)) {
            console.log('Error! yVal is not a number!');
            return;
        }
        else {
            statObj[statArry].push({
                x: xVal,
                y: yVal
            });
        }

        if (statObj[statArry].length > MAX_DATAPOINTS) {
            statObj[statArry].shift();
        };
    };

    updateHolders = function(msgObj, statsObj) {
        var timestamp = Date.parse(msgObj.time);
        // console.log('Timestamp: ' + timestamp);
        energyTemp += msgObj.power;

        updateStatArry(statsObj, 'voltageArry', timestamp, msgObj.voltage);
        updateStatArry(statsObj,'currentArry', timestamp, msgObj.current);
        updateStatArry(statsObj,'powerArry', timestamp, msgObj.power);
        updateStatArry(statsObj,'energyArry', timestamp, energyTemp);
    
        $('.stat #voltage').text(msgObj.voltage + " V");
        $('.stat #current').text(msgObj.current + " A");
        $('.stat #power').text(msgObj.power + " W");
        $('.stat #energy').text(energyTemp + " J");
        // $(rpm0Holder).text(msgObj.rpm0);
        // $(rpm1Holder).text(msgObj.rpm1);
        // $(rpm2Holder).text(msgObj.rpm2);
    
        renderAllCharts();
    };

    renderAllCharts();    
});
