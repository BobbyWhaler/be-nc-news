const express = require('express');
const { getApi, getTopics, getArticles, getArticleByID, getCommentsByID, postComment} = require('./controllers/nc-news');
const app = express();
app.use(express.json());
require('dotenv').config();

app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleByID);
app.get('/api/articles/:article_id/comments', getCommentsByID)

app.post('/api/articles/:article_id/comments', postComment)

app.all("/*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ message: "Bad Request" });
	} else {
		next(err);
	}
});

app.use((err, req, res, next) => {
  if ("status" in err) {
    res.status(err.status).send({ message: err.msg });
    return;
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not Found" });
  } else if (err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Server Error!');
});

module.exports = app;