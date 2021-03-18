var express = require('express');
var router = express.Router();
const successPrint = require('../helpers/debug/debugprinters').successPrint;
const errorPrint = require('../helpers/debug/debugprinters').errorPrint;
const {create} = require('../models/Comments');

router.post('/create', (req, res, next) => {
    if (!req.session.username) {
        errorPrint("You must be logged in first to comment");
        req.json({
            code: -1,
            status: "danger",
            message: "You must be logged in to comment"
        });
    }
    else {
        let {comment, postID} = req.body;
        let username = req.session.username;
        let userID = req.session.userID;
        create(userID, postID, comment)
            .then((wasSuccessful) => {
                if (wasSuccessful != -1) {
                    successPrint(`Comment was created for ${username}`);
                    res.json({
                        code: 1,
                        status: "Success",
                        message: "Comment was created",
                        comment: comment,
                        username: username
                    })
                } else {
                    errorPrint("Comment failed to post");
                    res.json({
                        code: -1,
                        status: "Danger",
                        message: "Comment could not be created"
                    })
                }
            })
            .catch((err) => next(err));

    }
})


module.exports = router;