// ------------------------------ General Functions ------------------------------

var MAX_DATAPOINTS = 20;
var energyTemp = 0;

// Array to hold our data
var electricStats = {
    voltageArry: [],
    currentArry: [],
    powerArry: [],
    energyArry: [],
    rpmArry: []
};

var updateHolders = function(){};

function changeTab(tabID) {
	// Hide all tabs
    $(".tab").hide();
    // Show specified tab with id = tabID
	$(".tab#" + tabID).show();
};

// ------------------------------ Socket.io Code ------------------------------

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

// ------------------------------ jQuery Functions ------------------------------

$(document).ready( function() {
    
    // ----- Button Code -----
    
    $('button#toggleRead').on('click', function(){
        console.log('TOGGLING');
        socket.emit('toggle', '');
    });

    $('button#basic').on('click', function(){
        console.log('Switching to basic view');
        changeTab("basic");
    });

    $('button#advanced').on('click', function(){
        console.log('Switching to advanced view');
        changeTab("advanced");
    });

    // ------------------------------ CanvasJS stuff ------------------------------

    // ----- Basic view charts -----

    var chartBasic1 = new CanvasJS.Chart("chartContainerPower", {
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
            dataPoints: electricStats.powerArry[0]
        }]
    });

    // ----- Advanced view charts -----

    var chartAdv1 = new CanvasJS.Chart("chartContainer1", {
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

    var chartAdv2 = new CanvasJS.Chart("chartContainer2", {
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

    var chartAdv3 = new CanvasJS.Chart("chartContainer3", {
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

    var chartAdv4 = new CanvasJS.Chart("chartContainer4", {
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
        // Render basic chart
        chartBasic1.render();

        // Render advanced charts
        chartAdv1.render();
        chartAdv2.render();
        chartAdv3.render();
        chartAdv4.render();
    }

    var updateStatArry = function(statObj, statArry, xVal, yVal) {
        if (isNaN(yVal)) {
            console.log("Arry: " + statArry);
            console.log("xVal: " + xVal);
            console.log("yVal: " + yVal);
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
        updateStatArry(statsObj,'rpmArry', timestamp, msgObj.rpm);
        updateStatArry(statsObj,'energyArry', timestamp, energyTemp);
    
        $('.stat #voltage').text(msgObj.voltage + " V");
        $('.stat #current').text(msgObj.current + " A");
        $('.stat #power').text(msgObj.power + " W");
        $('.stat #rpm').text(msgObj.rpm + " RPM");
        $('.stat #energy').text(energyTemp + " J");
        // $(rpm0Holder).text(msgObj.rpm0);
        // $(rpm1Holder).text(msgObj.rpm1);
        // $(rpm2Holder).text(msgObj.rpm2);
    
        renderAllCharts();
    };

    renderAllCharts();    
});
