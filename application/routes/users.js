var express = require('express');
var router = express.Router();
const UserError = require('../helpers/error/UserError');
const UserModel = require('../models/Users');
const errorPrint = require('../helpers/debug/debugprinters').errorPrint;
const successPrint = require('../helpers/debug/debugprinters').successPrint;


//Registration Routing
router.post('/registration', (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;

  //Do server side validation



  UserModel.usernameExists(username)
      .then((usernameDoesExist) => {
        if (usernameDoesExist) {
          throw new UserError(
              "Registration failed: Username already exists.",
              "/registration",
              200
          );
        }
        else {
          return UserModel.emailExists(email);
        }
      })
      .then((emailDoesExist) => {
        if (emailDoesExist) {
          throw new UserError(
              "Registration failed: Email already exists.",
              "/registration",
              200
          );
        }
        else {
          return UserModel.createUser(username, password, email);
        }
      })
      .then((createdUserID) => {
        if (createdUserID < 0) {
          throw new UserError(
              "Server Error: User could not be created.",
              "/registration",
              500
          );
        }
        else {
          successPrint("User.js --> User was created!");
          req.flash("Success", "User account was created!");
          res.redirect('/login');
        }
      })
      .catch((err) => {
        errorPrint("User could not be made", err);
        if (err instanceof UserError) {
          errorPrint(err.getMessage());
          req.flash("Error", err.getMessage());
          res.status(err.getStatus());
          res.redirect(err.getRedirectURL());
        }
        else {
          next(err);
        }
      });
});

//Login Routing
router.post('/login', (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  //Do server side validation


  UserModel.authenticate(username, password)
      .then((loggedUserID) => {
        if (loggedUserID > 0) {
          successPrint(`User ${username} is logged in.`);
          req.session.username = username;
          req.session.userID = loggedUserID;
          res.locals.logged = true;
          req.flash("Success", "You have been successfully logged in!");
          res.redirect('/');
        }
        else {
          throw new UserError(
              "Username and/or password is invalid!",
              "/login",
              200);
        }
      })
      .catch((err) => {
        errorPrint("User login failed");
        if (err instanceof UserError) {
          errorPrint(err.getMessage());
          req.flash("Error", err.getMessage());
          res.status(err.getStatus());
          res.redirect('/login');
        }
        else {
          next(err);
        }
      });
});

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint("Session could not be destroyed.");
      next(err);
    }
    else {
      successPrint("Session was destroyed.");
      res.clearCookie("cookieID");
      res.json({status: "OK", message: "User logged out."});
    }
  });
});

module.exports = router;
