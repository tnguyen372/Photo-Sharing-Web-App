const express = require('express');
const router = express.Router();
const database = require('../config/database');


router.get('/getAllUsers', (req, res, next) => {
    database.query('SELECT * FROM users;', (err, results, fields) =>
    {
        if (err) {
            next(err);
        }
        console.log(results);
        res.send(results);
    })
});

router.get('/getAllPosts', (req, res, next) => {
    database.query('SELECT * FROM posts;', (err, results, fields) =>
    {
        if (err) {
            next(err);
        }
        console.log(results);
        res.send(results);
    })
});

router.get('/getAllPosts', (req, res, next) => {
    database.query('SELECT * FROM posts;')
        .then(([results, fields]) => {
            console.log(results);
            res.send(results);
        })
        .catch((err) => {
            next(err);
        });
});

router.post('/createUser', (req, res, next) => {
   console.log(req.body);
   let username = req.body.username;
   let email = req.body.email;
   let password = req.body.password;

   //Validate user data, send back response if invalid
   // res.redirect('/registration');

   let baseSQL = 'INSERT INTO users (username, email, password, created)' +
       'VALUES (?, ?, ?, now())';
    database.query(baseSQL, [username, email, password])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                res.send('User\'s account was created successfully!');
            }
            else
                res.send('User\'s account could not be created.');
        })
});


module.exports = router;