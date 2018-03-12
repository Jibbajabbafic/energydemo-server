// Export object for multiple sensors
module.exports = function (pinNum) {
    this.pinNum = pinNum;
    this.rpm = 0;
    this.getRPM = function () {
        var max = 3000;
        var min = 500;
        this.rpm = Math.floor(Math.random() * (max - min + 1)) + min;
        return this.rpm;
    }
}