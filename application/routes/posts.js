var express = require('express');
var router = express.Router();
const successPrint = require('../helpers/debug/debugprinters').successPrint;
const errorPrint = require('../helpers/debug/debugprinters').errorPrint;
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostModel = require('../models/Posts');
var PostError = require('../helpers/error/PostError');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/images/upload-images");
    },
    filename: function(req, file, cb) {
        let fileExtension = file.mimetype.split("/")[1];
        let randomName = crypto.randomBytes(32).toString("hex");
        cb(null, `${randomName}.${fileExtension}`);
    }
});

var uploader = multer({storage: storage});

router.post('/createPost', uploader.single("upload-image"), (req, res, next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let thumbnailDestination = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userID = req.session.userID;

    //Validate post info server side


    sharp(fileUploaded).resize(200).toFile(thumbnailDestination).then(() => {
        return PostModel.create(title, description, fileUploaded, thumbnailDestination, fk_userID);
    })
        .then((postWasCreated) => {
            if (postWasCreated) {
                req.flash("Success", "Your post has been created!");
                res.redirect("/");
            }
            else {
                throw new PostError("Post could not be created.", "/postimage", 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash("Error", err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }
            else {
                next(err);
            }
        })
});
//localhost:3000/posts/search?search=value
router.get('/search', async (req, res, next) => {
    let searchTerm = req.query.search;
    if (!searchTerm) {
        res.send({
            message: "No search term given",
            results: []
        });
    }
    else {
        let results = await PostModel.search(searchTerm);
        //If search term matched database result, show the matching posts
        if (results.length) {
            res.send({
                message: `${results.length} results found`,
                results: results
            });
        }
        //Otherwise search term did not match a database result
        else {
            let results = await PostModel.getNumRecentPosts(8);
            res.send({
                message: "No results found for search term. Here are the 8 most recent posts instead.",
                results: results
            })
        }
    }
});

module.exports = router;