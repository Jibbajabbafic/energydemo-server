// import bcrypt to perform password checks
const bcrypt = require('bcrypt');

// keep db in seperate file away from code
const db = require('./db.json');

exports.findById = (id, callback) => {
    // make findById operate asynchronously
    process.nextTick(() => {
        // find the first entry in db which has the corresponding id
        let record = db.find(entry => entry.id === id)

        if (record) callback(null, record);
        else callback(new Error('No user with ID ' + id));
    });
};

exports.findByUsername = (username, callback) => {
    // make findByUsername operate asynchronously
    process.nextTick(() => {
        // find the first entry in db which has the corresponding username
        let record = db.find(entry => entry.username === username)

        if (record) callback(null, record);
        else callback(null, null);
    });
};

// exports.validPasswordSync = (password, user) => {
//     return bcrypt.compareSync(password, user.passwordHash);
// };

exports.validPassword = (password, user, callback) => {
    bcrypt.compare(password, user.passwordHash, (err, res) => {
        // check if any errors occurred
        if(err) 
            return callback(err);
        
        // return status of compare
        callback(null, res);
    });
}
