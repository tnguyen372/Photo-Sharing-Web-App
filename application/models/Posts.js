var database = require('../config/database');
const PostModel = {};

PostModel.create = (title, description, photoPath, thumbnail, fk_userID) => {
    let baseSQL = "INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) \
            VALUE (?, ?, ?, ?, now(), ?);";
    return database.execute(baseSQL, [title, description, photoPath, thumbnail, fk_userID])
        .then(([results, fields]) => {
            return Promise.resolve(results && results.affectedRows);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.search = (searchTerm) => {
    let baseSQL = "SELECT id, title, description, thumbnail, concat_ws(\' \', title, description) AS haystack \
            FROM posts \
            HAVING haystack like ?;";
    let sqlReadySearchTerm = "%"+ searchTerm + "%";
    return database.execute(baseSQL, [sqlReadySearchTerm])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getNumRecentPosts = (numOfPosts) => {
    let baseSQL = "SELECT id, title, description, thumbnail, created FROM posts ORDER BY created DESC LIMIT ?;";
    return database.query(baseSQL, [numOfPosts])
        .then(([results, fields]) => {
            return Promise.resolve(results);
        })
        .catch((err) => Promise.reject(err));
};

PostModel.getPostByID = (postID) => {
  let baseSQL = `SELECT u.username, p.title, p.description, p.photopath, p.created 
  FROM users u 
  JOIN posts p 
  ON u.id=fk_userid 
  WHERE p.id=?;`;

  return database.execute(baseSQL, [postID])
      .then(([results, fields]) => {
          return Promise.resolve(results);
      })
      .catch((err) => Promise.reject(err));
}

module.exports = PostModel;