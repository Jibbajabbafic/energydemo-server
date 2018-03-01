// Module to execute python scripts
var PythonShell = require('python-shell');

// Set up default options
PythonShell.defaultOptions = { 
    mode: 'json',
    scriptPath: './bin/python'
};

PythonShell.run("read_ina.py", {args: [0x40]}, function (err, data) {
    if (err) {
        console.log(err);
        return err;
    }

    console.log("Return data:");
    console.log(data);
});