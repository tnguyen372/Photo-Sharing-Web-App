const {getNumRecentPosts, getPostByID} = require('../models/Posts');
const postMiddleware = {};
const {getCommentsForPost} = require('../models/Comments');
postMiddleware.getRecentPosts = async function(req, res, next) {
    try {
        let results = await getNumRecentPosts(8);
        res.locals.results = results;
        if (results.length == 0) {
            req.flash("Error", "There are no posts created yet");
        }
        next();
    }
    catch(err) {
        next(err);
    }
}

postMiddleware.getPostByID = async function(req, res, next) {
    try {
        let postID = req.params.id;
        let results = await getPostByID(postID);
        if (results && results.length) {
            res.locals.currentPost = results[0];
            next();
        }
        else {
            res.flash("Error", "This is not the post you're looking for");
            res.redirect('/');
        }
    }
    catch (error) {
        next(error);
    }
}

postMiddleware.getCommentsByPostID = async function(req, res, next) {
    let postID = req.params.id;
    try {
        let results = await getCommentsForPost(postID);
        res.locals.currentPost.comments = results;
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = postMiddleware;