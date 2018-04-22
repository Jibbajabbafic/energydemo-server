// ------------------------------ General Functions ------------------------------

var MAX_DATAPOINTS_BASIC = 1;
var MAX_DATAPOINTS_ADV = 50;

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

// Function to specified tab
function changeTab(tabID) {
	// Hide all tabs
    $(".tab").hide();
    $("button.nav").prop('disabled', false);
    $("button.nav").css('background-color', '#90c2e7');

    // Show specified tab with id = tabID
    $("button.nav#"+tabID).prop('disabled', true);
    $("button.nav#"+tabID).css('background-color', '#90e79e');
	$(".tab#" + tabID).show();
};

// Function to format seconds into hours, minutes and seconds
function fancyTimeFormat(time) {   
    if (time == Infinity) return "Never";
    console.log("Time input: ", time);
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = Math.round(time % 60);

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + "hrs " + (mins < 10 ? "0" : "");
    }
   
    if (mins > 0) {
        ret += "" + mins + "mins " + (secs < 10 ? "0" : "");
    }
    
    ret += "" + secs + "s ";
    
    return ret;

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

socket.on('temps', function(data) {
    console.log('Received temps: ');
    console.log(data);

    $('span#amount').text(data.amount*1000);
    $('span#target').text(data.target);
    $('span#ambient').text(data.ambient);
    $('span#kettle').text(data.kettle);

    let lastEntryBike = statList[0].powerArry.length - 1
    let lastEntryHandcrank = statList[1].powerArry.length - 1

    let powerBike = statList[0].powerArry[lastEntryBike].y;
    let powerHandcrank = statList[1].powerArry[lastEntryHandcrank].y;
    
    let timeBike = data.energy / powerBike;
    let timeHandcrank = data.energy / powerHandcrank;
    
    $('span#est-time-bike').text(fancyTimeFormat(timeBike));
    $('span#est-time-handcrank').text(fancyTimeFormat(timeHandcrank));

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
    
    // start with basic charts as default
    changeTab("basic");

    // ----- Nav Button Code -----

    $('button#basic').on('click', function(){
        console.log('Switching to basic view');
        // $('.navTab').toggleClass('enabled');
        changeTab("basic");
        // $('.tab').toggle();
    });

    $('button#advanced').on('click', function(){
        console.log('Switching to advanced view');
        changeTab("advanced");
        // $('.navTab').toggleClass('enabled');
        // $('.tab').toggle();
    });

    $('button#temperature').on('click', function(){
        $(this).toggleClass('enabled disabled');
        $('.temp-box').toggle();
    });    

    // ----- Graph Button Code -----

    $('button#bike').on('click', function(){
        $(this).toggleClass('enabled disabled');
        $('.chartHolder.bike#advanced').toggle();
    });

    $('button#handcrank').on('click', function(){
        $(this).toggleClass('enabled disabled');
        $('.chartHolder.handcrank#advanced').toggle();
    });    

    // ------------------------------ CanvasJS stuff ------------------------------

    // --------------- Basic view charts ---------------
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
            type: "column",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss.fff",
            dataPoints: statList[0].powerArryBasic
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
            type: "column",
            xValueType: "dateTime",
            xValueFormatString: "HH:mm:ss.fff",
            dataPoints: statList[1].powerArryBasic
        }]
    };

    var chartBasic1 = new CanvasJS.Chart("chartContainerPower1", basicChartPowerOptions1);
    var chartBasic2 = new CanvasJS.Chart("chartContainerPower2", basicChartPowerOptions2);

    // --------------- Advanced view charts ---------------

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

    // Function to render all charts on the page easily
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

    // Function to update an array of stats and ensure it doesn't go over the datapoint limit
    var updateStatArry = function(statObj, statArry, xVal, yVal, max_datapoints) {
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

        if (statObj[statArry].length > max_datapoints) {
            statObj[statArry].shift();
        };
    };
    
    // Function to update stats with data, searches for entry with the same name
    updateStats = function(msgObj) {
        var timestamp = Date.parse(msgObj.time);
    
        statID = searchList(statList, "name", msgObj.name);
    
        if (statID === -1) {
            console.log("Error: that entry does not exist!");
        }
    
        try {
            var lastEntry = statList[statID].energyArry.length - 1
            var energy = statList[statID].energyArry[lastEntry].y + msgObj.power;
        } catch (TypeError) {
            var energy = msgObj.power;
        }
    
        // Update advanced chart data arrays
        updateStatArry(statList[statID], 'voltageArry', timestamp, msgObj.voltage, MAX_DATAPOINTS_ADV);
        updateStatArry(statList[statID],'currentArry', timestamp, msgObj.current, MAX_DATAPOINTS_ADV);
        updateStatArry(statList[statID],'powerArry', timestamp, msgObj.power, MAX_DATAPOINTS_ADV);
        updateStatArry(statList[statID],'rpmArry', timestamp, msgObj.rpm, MAX_DATAPOINTS_ADV);
        updateStatArry(statList[statID],'energyArry', timestamp, energy, MAX_DATAPOINTS_ADV);

        // Update basic chart data arrays
        updateStatArry(statList[statID],'powerArryBasic', timestamp, msgObj.power, MAX_DATAPOINTS_BASIC);

        // $('.stat #voltage').text(msgObj.voltage + " V");
        // $('.stat #current').text(msgObj.current + " A");
        // $('.stat #power').text(msgObj.power + " W");
        // $('.stat #rpm').text(msgObj.rpm + " RPM");
        // $('.stat #energy').text(energy + " J");

        renderAllCharts();
    }

    renderAllCharts();    
});
