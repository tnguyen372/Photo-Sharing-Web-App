var express = require('express');
var router = express.Router();
const {getRecentPosts, getPostByID, getCommentsByPostID} = require('../middleware/postsmiddleware');
var database = require('../config/database');

/* GET home page. */
//localhost:3000. Render all these templates
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index',{title:"Home Page"});
});

router.get('/login', (req, res, next) => {
  res.render("login", {title:"Login"});
});

router.get('/registration', (req, res, next) => {
  res.render("registration", {title:"Registration"});
});

//router.use('/postimage', isLoggedIn);
router.get('/postimage', (req, res, next) => {
  res.render("postimage", {title:"Create A Post"});
});



router.get('/post/:id(\\d+)', getPostByID, getCommentsByPostID, (req, res, next) => {
    res.render("imagepost", {title: `Post ${req.params.id}`});
});

module.exports = router;
