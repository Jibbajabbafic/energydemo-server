var bcrypt = require('bcrypt');
const saltRounds = 10;

const userList = [
    {
        username: "admin",
        plaintextPass: "meng group 5"
    }
]

var table = [];

var id_count = 1;

// iterate through userlist and generate hashes and ids for each table entry
userList.forEach(element => {
    console.log("Hashing password for: " + element.username);
    var hash = bcrypt.hashSync(element.plaintextPass, saltRounds);
    table.push({
        id: id_count,
        username: element.username,
        passwordHash: hash
    })
    id_count += 1;
});

var json = JSON.stringify(table);

var fs = require('fs');
fs.writeFile('users_hashed.json', json, 'utf8', () => console.log("Userlist written to file!"));