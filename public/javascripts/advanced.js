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

// var updateChart = function(){};
// var updateStatArry = function(){};
// var renderAllCharts = function(){};
var updateHolders = function(){};

var x = 0;
var startRand = false;
var intervalID;

var testMsg = {
    text: 'test msg number: ' + x
};

// ----- PubNub Stuff -----
var pubnub = new PubNub({
    subscribeKey: "sub-c-1089702c-c016-11e7-97ca-5a9f8a2dd46d",
    publishKey: "pub-c-d0429aa8-023b-4f06-9d6d-fb916ae807f1",
    ssl: true
});

pubnub.addListener({
    message: function(m) {
        console.log(m);
        updateHolders(m.message, electricStats);
    }
});

pubnub.subscribe({
    channels: ['rpi']
});

// ----- jQuery Functions -----
$(document).ready( function() {

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
            showInLegend: true,
            type: "line",
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
            showInLegend: true,
            type: "line",
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
            showInLegend: true,
            type: "line",
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
            showInLegend: true,
            type: "line",
            dataPoints: electricStats.energyArry
        }]
    });

    var renderAllCharts = function() {
        chart1.render();
        chart2.render();
        chart3.render();
        chart4.render();
    }

    function randGen(offset, mult) {
        return Math.random() * mult + offset;
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
        var power = msgObj.voltage * msgObj.current;
        energyTemp += power;

        updateStatArry(statsObj, 'voltageArry', timeVal, msgObj.voltage);
        updateStatArry(statsObj,'currentArry', timeVal, msgObj.current);
        updateStatArry(statsObj,'powerArry', timeVal, power);
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
