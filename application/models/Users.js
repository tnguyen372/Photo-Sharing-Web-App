var database = require("../config/database");
const UserModel = {};
var bcrypt = require('bcrypt');

//Create a new user
UserModel.createUser = (username, password, email) => {
    return bcrypt.hash(password, 15)
        .then((hashedPassword) => {
            let baseSQL = "INSERT INTO users (username, email, password, created) VALUES (?, ?, ?, now());";
            return database.execute(baseSQL, [username, email, hashedPassword]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            }
            else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => {return Promise.reject(err)});
};
//Determine if the username exists
UserModel.usernameExists = (username) => {
    return database.execute("SELECT * FROM users WHERE username=?", [username])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => {return Promise.reject(err)});
};
//Determine if the email exists
UserModel.emailExists = (email) => {
    return database.execute("SELECT * FROM users WHERE email=?", [email])
        .then(([results, fields]) => {
            return Promise.resolve(!(results && results.length == 0));
        })
        .catch((err) => {return Promise.reject(err)});
};
//Determine if the username and password match with an account
UserModel.authenticate = (username, password) => {
    let userID;
    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    return database.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                userID = results[0].id;
                return bcrypt.compare(password, results[0].password);
            }
            else {
                return Promise.reject(-1);
            }
        })
        .then((passwordsMatch) => {
            if (passwordsMatch) {
                return Promise.resolve(userID);
            }
            else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => {return Promise.reject(err)});
};

module.exports = UserModel;