const db = require("../db/connection.js");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => rows);
};

exports.selectArticles = (query) => {
  let queryStr =
    "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;";

  if (query.hasOwnProperty("topic")) {
    return db
      .query("SELECT slug FROM topics;")
      .then(({ rows }) => {
        const slugArr = [];
        rows.forEach((topic) => slugArr.push(topic.slug));
        if (!slugArr.includes(query.topic)) {
          return Promise.reject({
            status: 404,
            msg: "Topic Not Found",
          });
        }
        return undefined;
      })
      .then(() => {
        return db.query(
          "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.topic = $1 GROUP BY articles.article_id ORDER BY created_at DESC;",
          [query.topic]
        );
      })
      .then(({ rows }) => rows);
  } else if (query.hasOwnProperty("sort_by") && query.sort_by !== "") {
    let sortBy = "";
    if (
      query.sort_by === "article_id" ||
      query.sort_by === "title" ||
      query.sort_by === "topic" ||
      query.sort_by === "body"
    ) {
      sortBy = "ASC";
    } else {
      sortBy = "DESC";
    }
    return db
      .query(
        `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${query.sort_by} ${sortBy};`
      )
      .then(({ rows }) => rows);
  } else if (query.hasOwnProperty("order") && query.order !== "") {
    return db
      .query(
        `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at ${query.order.toUpperCase()};`
      )
      .then(({ rows }) => rows);
  } else {
    return db.query(queryStr).then(({ rows }) => rows);
  }
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
exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => rows);
}
