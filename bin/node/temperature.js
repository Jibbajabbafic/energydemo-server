const ds18 = require('ds18x20');

const Probe = {
    kettle: "28-0517607924ff",
    ambient: "28-031760640fff"
};

function fancyTimeFormat(time) {   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + " hrs " + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + " mins " + (secs < 10 ? "0" : "");
    ret += "" + secs + "s ";
    return ret;
}

var Temperature = function(SAMPLE_TIME) {
//     this.SAMPLE_TIME = SAMPLE_TIME;

    this.target_temp = 100;
    this.mass = 0.3;
    this.heat_capacity = 4190;

    ds18.isDriverLoaded(function (err, isLoaded) {
        if (!isLoaded)  console.log("WARNING: Temperature sensor driver not loaded!");
//        console.log("Driver loaded: " + isLoaded);
    });

    console.log("Temperature module loaded");
}

Temperature.prototype.readAll = function (callback) {

    ds18.get([Probe.kettle, Probe.ambient], (err, tempList) => {
	if (err) callback(err);

	let temp_kettle = 0;
        let temp_ambient = 0;

        if (tempList) {
            temp_kettle = tempList[0];
            temp_ambient = tempList[1];
        };
        
        if(!temp_kettle) callback(new Error("Can't read kettle probe!"));
        if(!temp_ambient) callback(new Error("Can't read ambient probe!"));

        let energy = this.heat_capacity*this.mass*(this.target_temp - temp_kettle);

        callback(null, temp_kettle, temp_ambient, energy);
    });
};

module.exports = Temperature;