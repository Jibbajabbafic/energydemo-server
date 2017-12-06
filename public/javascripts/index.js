// ----- General Functions -----

var MAX_DATAPOINTS = 1;
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

// ----- PubNub Code -----
// var pubnub = new PubNub({
//     subscribeKey: "sub-c-1089702c-c016-11e7-97ca-5a9f8a2dd46d",
//     publishKey: "pub-c-d0429aa8-023b-4f06-9d6d-fb916ae807f1",
//     ssl: true
// });

// pubnub.addListener({
//     message: function(m) {
//         console.log(m);
//         updateHolders(m.message, electricStats);
//     }
// });

// pubnub.subscribe({
//     channels: ['rpi']
// });

// ----- jQuery Functions -----
$(document).ready( function() {

    // ----- CanvasJS stuff -----

    // Create new charts to hold our data
    var barChart1 = new CanvasJS.Chart("barChart1", {
        title: {
            text: "Power Output"
        },
        axisY: {
            title: "Power (W)",
            viewportMinimum: 0,
            viewportMaximum: 1000,
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
                    value: 700,
                    color: '#ffc400',
                    label: "Toaster",
                    showOnTop: true
                }

            ]
        },
        data: [{
            type: "bar",
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
        barChart1.render();
        // barChart2.render();
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
