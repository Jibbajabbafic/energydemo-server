// ----- General Functions -----

var MAX_DATAPOINTS = 20;
var timeVal = 0;
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
    var parsedData = JSON.parse(data);
    console.log('Received stats: ');
    console.log(parsedData);
    // pushStats(electricStats, 'power', parsedData);
    updateHolders(parsedData, electricStats);
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
        energyTemp += msgObj.power;

        updateStatArry(statsObj, 'voltageArry', timeVal, msgObj.voltage);
        updateStatArry(statsObj,'currentArry', timeVal, msgObj.current);
        updateStatArry(statsObj,'powerArry', timeVal, msgObj.power);
        updateStatArry(statsObj,'energyArry', timeVal, energyTemp);
    
        timeVal++;
    
        // $(voltageHolder).text(msgObj.voltage);
        // $(currentHolder).text(msgObj.current);
        // $(powerHolder).text(power);
        // $(rpm0Holder).text(msgObj.rpm0);
        // $(rpm1Holder).text(msgObj.rpm1);
        // $(rpm2Holder).text(msgObj.rpm2);
    
        renderAllCharts();
    };

    renderAllCharts();    
});
