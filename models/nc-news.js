const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};
exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
    )
    .then(({ rows }) => rows);
};
exports.selectArticleByID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => articles.rows[0])
    .then((article) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return article;
      }
    });
};
exports.selectCommentsByArticleID = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => articles.rows[0])
    .then((article) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return db
          .query(
            "SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC;",
            [article_id]
          )
          .then((comments) => comments.rows)
          .then((comment) => {
            if (comment.length === 0) {
              return [];
            } else {
              return comment;
            }
          });
      }
    });
};
exports.insertComments = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      "INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [article_id, username, body]
    )
    .then(({ rows }) => {
      if (typeof body !== "string") {
        return Promise.reject({
          status: 400,
          msg: "Bad Request",
        });
      }
      return rows[0];
    });
};
exports.updateArticleByID = (voteUpdates, article_id) => {
  const { inc_votes } = voteUpdates;
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((articles) => articles.rows[0])
    .then((article) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      } else {
        return db
          .query(
            "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
            [inc_votes, article_id]
          )
          .then(({ rows }) => {
            if (typeof inc_votes !== "number") {
              return Promise.reject({
                status: 400,
                msg: "Bad Request",
              });
            }
            return rows[0];
          });
      }
    });
};
