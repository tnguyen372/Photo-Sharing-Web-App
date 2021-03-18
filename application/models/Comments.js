var database = require('../config/database');
const CommentModel = {};

CommentModel.create = (userID, postID, comment) => {
    let baseSQL = `INSERT INTO comments (comment, fk_postid, fk_authorid) VALUES (?, ?, ?);`;
    return database.query(baseSQL, [comment, postID, userID])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                return Promise.resolve(results.insertId);
            }
            else {
                return Promise.resolve(-1);
            }
        })
        .catch((err) => Promise.reject(err));
};

CommentModel.getCommentsForPost = (postID) => {
    let baseSQL = `SELECT u.username, c.comment, c.created, c.id
    FROM comments c
    JOIN users u
    on u.id=fk_authorid
    WHERE c.fk_postid=?
    ORDER BY c.created DESC`;
    return database.query(baseSQL, [postID])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

module.exports = CommentModel;