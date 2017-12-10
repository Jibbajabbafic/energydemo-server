// ----- General Functions -----

var MAX_DATAPOINTS = 1;
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
    // var parsedData = data[0];
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
    // When clicked emits a 'toggle' event
    $('#toggleRead').on('click', function(){
        console.log('TOGGLING');
        socket.emit('toggle', '');
    });
    // ----- CanvasJS stuff -----

    // Create new charts to hold our data
    var barChartPower = new CanvasJS.Chart("powerChart", {
        title: {
            text: "Power Output"
        },
        axisY: {
            title: "Power (W)",
            suffix: "W",
            viewportMinimum: 0,
            viewportMaximum: 1000,
            animationEnabled: true,
            animationDuration: 5000,
            stripLines:[
                {                
                    value: 10,
                    color: '#ffc400',
                    label: "LED Light",
                    showOnTop: true
                },
                {                
                    value: 50,
                    color: '#ffc400',
                    label: "Fluorescent Light",
                    showOnTop: true
                },
                {                
                    value: 100,
                    color: '#ffc400',
                    label: "Incandescent Light",
                    showOnTop: true
                },
                {                
                    value: 200,
                    color: '#ffc400',
                    label: "Fan",
                    showOnTop: true
                },
                {                
                    value: 700,
                    color: '#ffc400',
                    label: "Toaster",
                    showOnTop: true
                }

            ]
        },
        data: [{
            type: "bar",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss.fff",
            dataPoints: electricStats.powerArry
        }]
    });

    // var barChart2 = new CanvasJS.Chart("barChart2", {
    //     title: {
    //         text: "Cumulative Energy"
    //     },
    //     axisX: {
    //         title: "Time (s)"
    //     },
    //     axisY: {
    //         title: "Energy (J)"
    //     },
    //     data: [{
    //         showInLegend: true,
    //         type: "column",
    //         dataPoints: electricStats.energyArry
    //     }]
    // });

    var renderAllCharts = function() {
        barChartPower.render();
        // barChart2.render();
    }

    var updateStatArry = function(statObj, statArry, labelStr, xVal, yVal) {
        if (isNaN(yVal)) {
            console.log('Error! yVal is not a number!');
            return;
        }
        else {
            statObj[statArry].push({
                label: labelStr,
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
        console.log('Timestamp: ' + timestamp);
        // energyTemp += msgObj.power;

        // updateStatArry(statsObj, 'voltageArry', 'Voltage', timeVal, msgObj.voltage);
        // updateStatArry(statsObj,'currentArry', 'Current', timeVal, msgObj.current);
        updateStatArry(statsObj,'powerArry', 'Handcrank', timestamp, msgObj.power);
        // updateStatArry(statsObj,'energyArry', 'Energy', timeVal, energyTemp);
    
        // timeVal++;
    
        // $(voltageHolder).text(msgObj.voltage);
        // $(currentHolder).text(msgObj.current);
        // $(powerHolder).text(msgObj.power);
        // $(rpm0Holder).text(msgObj.rpm0);
        // $(rpm1Holder).text(msgObj.rpm1);
        // $(rpm2Holder).text(msgObj.rpm2);
    
        renderAllCharts();
    };

    renderAllCharts();    
});
