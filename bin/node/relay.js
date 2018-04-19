var rpio = require('rpio');

const Pins = {
    lights: {
        bike: 21,
        handcrank: 22
    },
    kettle: {
        bike: 23,
        handcrank: 24
    },
    charger: {
        bike: 11,
        handcrank: 12
    }
};

Pins.iterate = (callback) => {
    // make call asynchronous
    process.nextTick( () => {
        // utility function to go through each pin with its input and output
        for(output in Pins) {
            for (input in Pins[output]) {
                let pin = Pins[output][input];
                callback(input, output, pin);
            };
        };
    })
}

const initAll = () => {
    // initialise all pins defined in Pins to be outputs and set to low
    Pins.iterate( (input, output, pin) => {
        rpio.open(pin, rpio.OUTPUT, rpio.LOW);
        // console.log("Init " + input + " to " + output + " connection on pin: " + pin);
    });
};

function Relay() {
    // rpio options
    var options = {
        // gpiomem: true,          /* Use /dev/gpiomem */
        mapping: 'physical',    /* Use the P1-P40 numbering scheme */
        // mock: undefined,        /* Emulate specific hardware in mock mode */
    }

    rpio.init(options);
    initAll();

    console.log("Relay module loaded");
};

Relay.prototype.disableAll = () => {
    console.log("Disabling all relays");
    Pins.iterate( (input, output, pin) => {
        // console.log("Disabling " + input + " to " + output + " connection on pin: " + pin);
        rpio.write(pin, rpio.LOW);
    });
}

// Relay.prototype.connect = (input, output) => {
//     // make the connection call asynchronous
//     process.nextTick( () => {
//         let pin = Pins[output][input];
//         console.log("Enabling " + input + " to " + output + " connection on pin: " + pin);
//         rpio.write(pin, rpio.HIGH);
//     });
// };

Relay.prototype.setAll = (relayState) => {
    // make call asynchronous
    process.nextTick(() => {
        Pins.iterate( (input, output, pin) => {
            if (relayState[output] === input) {
                console.log("Enabling " + input + " to " + output + " connection on pin: " + pin);
                rpio.write(pin, rpio.HIGH);
            }
        });
    })
}

module.exports = Relay;