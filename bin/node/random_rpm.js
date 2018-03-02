// Export object for multiple sensors
module.exports = function (pinNum) {
    this.pinNum = pinNum;
    this.rpm = 0;
    this.getRPM = function () {
        var max = 500;
        var min = 1;
        this.rpm = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.rpm;
    }
}