// ------------------------------ General Functions ------------------------------

var MAX_DATAPOINTS = 50;
var energyTemp = 0;

// Array to hold our data
// var electricStats = {
//     voltageArry: [],
//     currentArry: [],
//     powerArry: [],
//     energyArry: [],
//     rpmArry: []
// };

var statList = [
    {
        name: "bike", 
        voltageArry: [],
        currentArry: [],
        powerArry: [],
        powerArryBasic: [],
        energyArry: [],
        rpmArry: []
    },
    {
        name: "handcrank", 
        voltageArry: [],
        currentArry: [],
        powerArry: [],
        powerArryBasic: [],
        energyArry: [],
        rpmArry: []
    },
];

// var updateHolders = function(){};
var updateStats = function(){};

function searchList(list, property, value) {
    for (var i = 0; i < list.length; i++) {
        if (list[i][property] == value) {
            return i;
        }
    }
    return -1;
}

// function makeEntry(msgObj, statsObj) {
//     console.log("Making entry!");
//     return -1 + statList.push({
//         name: msgObj.name, 
//         voltageArry: [],
//         currentArry: [],
//         powerArry: [],
//         energyArry: [],
//         rpmArry: []
//     })
// };    

function changeTab(tabID) {
	// Hide all tabs
    $(".tab").hide();
    $("button.nav").prop('disabled', false);
    // Show specified tab with id = tabID
    $("button.nav#" + tabID).prop('disabled', true);
	$(".tab#" + tabID).show();
};

// ------------------------------ Socket.io Code ------------------------------

// Define socket which automatically uses the connected server
var socket = io();

// Define what to do when stats are received
socket.on('stats', function(data) {
    console.log('Received stats: ');
    console.log(data);

    // updateHolders(data, electricStats);
    updateStats(data);
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
    var basicChartPowerOptions1 = {
        title: {
            text: "Power Output of " + statList[0].name
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
                    value: 250,
                    color: '#ffc400',
                    label: "Travel Kettle",
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
            dataPoints: statList[0].powerArry
        }]
    };

    var basicChartPowerOptions2 = {
        title: {
            text: "Power Output of " + statList[1].name
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
                    value: 250,
                    color: '#ffc400',
                    label: "Travel Kettle",
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
            dataPoints: statList[1].powerArry
        }]
    };

    var chartBasic1 = new CanvasJS.Chart("chartContainerPower1", basicChartPowerOptions1);
    var chartBasic2 = new CanvasJS.Chart("chartContainerPower2", basicChartPowerOptions2);

    // ----- Advanced view charts -----

    var chartAdv1 = new CanvasJS.Chart("chartContainer1", {
        title: {
            text: "Power Output of " + statList[0].name
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
            dataPoints: statList[0].powerArry
        }]
    });

    var chartAdv2 = new CanvasJS.Chart("chartContainer2", {
        title: {
            text: "Voltage Output of " + statList[0].name
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
            dataPoints: statList[0].voltageArry
        }]
    });

    var chartAdv3 = new CanvasJS.Chart("chartContainer3", {
        title: {
            text: "Current Output of " + statList[0].name
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
            dataPoints: statList[0].currentArry
        }]
    });

    // var chartAdv4 = new CanvasJS.Chart("chartContainer4", {
    //     title: {
    //         text: "Cumulative Energy of " + statList[0].name
    //     },
    //     axisX: {
    //         title: "Time (s)"
    //     },
    //     axisY: {
    //         title: "Energy (J)"
    //     },
    //     data: [{
    //         type: "spline",
    //         xValueType: "dateTime",
    //         xValueFormatString: "HH:mm:ss",
    //         dataPoints: statList[0].energyArry
    //     }]
    // });

    var chartAdv4 = new CanvasJS.Chart("chartContainer4", {
        title: {
            text: "Speed of " + statList[0].name
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Speed (RPM)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: statList[0].rpmArry
        }]
    });

// ---------- NEXT INPUT ----------

    var chartAdv5 = new CanvasJS.Chart("chartContainer5", {
        title: {
            text: "Power Output of " + statList[1].name
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
            dataPoints: statList[1].powerArry
        }]
    });

    var chartAdv6 = new CanvasJS.Chart("chartContainer6", {
        title: {
            text: "Voltage Output of " + statList[1].name
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
            dataPoints: statList[1].voltageArry
        }]
    });

    var chartAdv7 = new CanvasJS.Chart("chartContainer7", {
        title: {
            text: "Current Output of " + statList[1].name
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
            dataPoints: statList[1].currentArry
        }]
    });

    // var chartAdv4 = new CanvasJS.Chart("chartContainer8", {
    //     title: {
    //         text: "Cumulative Energy of " + statList[1].name
    //     },
    //     axisX: {
    //         title: "Time (s)"
    //     },
    //     axisY: {
    //         title: "Energy (J)"
    //     },
    //     data: [{
    //         type: "spline",
    //         xValueType: "dateTime",
    //         xValueFormatString: "HH:mm:ss",
    //         dataPoints: statList[1].energyArry
    //     }]
    // });

    var chartAdv8 = new CanvasJS.Chart("chartContainer8", {
        title: {
            text: "Speed of " + statList[1].name
        },
        axisX: {
            title: "Time (s)"
        },
        axisY: {
            title: "Speed (RPM)"
        },
        data: [{
            type: "spline",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss",
            dataPoints: statList[1].rpmArry
        }]
    });

    var renderAllCharts = function() {
        // Render basic chart
        chartBasic1.render();
        chartBasic2.render();

        // Render advanced charts
        chartAdv1.render();
        chartAdv2.render();
        chartAdv3.render();
        chartAdv4.render();

        chartAdv5.render();
        chartAdv6.render();
        chartAdv7.render();
        chartAdv8.render();
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

    // updateHolders = function(msgObj, statsObj) {
    //     var timestamp = Date.parse(msgObj.time);
    //     // console.log('Timestamp: ' + timestamp);
    //     energyTemp += msgObj.power;

    //     updateStatArry(statsObj, 'voltageArry', timestamp, msgObj.voltage);
    //     updateStatArry(statsObj,'currentArry', timestamp, msgObj.current);
    //     updateStatArry(statsObj,'powerArry', timestamp, msgObj.power);
    //     updateStatArry(statsObj,'rpmArry', timestamp, msgObj.rpm);
    //     updateStatArry(statsObj,'energyArry', timestamp, energyTemp);
    
    //     $('.stat #voltage').text(msgObj.voltage + " V");
    //     $('.stat #current').text(msgObj.current + " A");
    //     $('.stat #power').text(msgObj.power + " W");
    //     $('.stat #rpm').text(msgObj.rpm + " RPM");
    //     $('.stat #energy').text(energyTemp + " J");
    //     // $(rpm0Holder).text(msgObj.rpm0);
    //     // $(rpm1Holder).text(msgObj.rpm1);
    //     // $(rpm2Holder).text(msgObj.rpm2);
    
    //     renderAllCharts();
    // };
    
    updateStats = function(msgObj) {
        var timestamp = Date.parse(msgObj.time);
    
        statID = searchList(statList, "name", msgObj.name);
    
        if (statID === -1) {
            console.log("Error: that entry does not exist!");
            // statID = makeEntry(msgObj, statList);
        }
    
        try {
            var lastEntry = statList[statID].energyArry.length - 1
            var energy = statList[statID].energyArry[lastEntry]["y"] + msgObj.power;
        } catch (TypeError) {
            var energy = msgObj.power;
        }
    
        updateStatArry(statList[statID], 'voltageArry', timestamp, msgObj.voltage);
        updateStatArry(statList[statID],'currentArry', timestamp, msgObj.current);
        updateStatArry(statList[statID],'powerArry', timestamp, msgObj.power);
        updateStatArry(statList[statID],'rpmArry', timestamp, msgObj.rpm);
        updateStatArry(statList[statID],'energyArry', timestamp, energy);

        // $('.stat #voltage').text(msgObj.voltage + " V");
        // $('.stat #current').text(msgObj.current + " A");
        // $('.stat #power').text(msgObj.power + " W");
        // $('.stat #rpm').text(msgObj.rpm + " RPM");
        // $('.stat #energy').text(energy + " J");

        renderAllCharts();
    }

    renderAllCharts();    
});
