const bcrypt = require('bcrypt');

// load file with users in it to keep it seperate from main code
const user = require('./auth/users.json');

const findOneAsync = (username, password, callback) => {
    var result = user.find(entry => entry.username === username);

    if (!result) callback("User " + username + " not found!");
    else {
        bcrypt.compare(password, result.passwordHash, (err, res) => {
            if(err) callback(err);
            else {
                if (res) callback(null, "Login success!\nWelcome back " + username);
                else callback(null, "Invalid password for user: " + username);
            };
        });
    }
}

const errHandler = (err, res) => {
    if(err) console.error(err);
    else console.log(res);
}

findOneAsync("test", null, errHandler);
findOneAsync("test", "wrong pass", errHandler);
findOneAsync("admin", "another wrong pass", errHandler);
findOneAsync("admin", "meng group 5", errHandler);