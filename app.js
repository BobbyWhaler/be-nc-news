const express = require('express');
const { getApi, getTopics, getArticles } = require('./controllers/nc-news');
const app = express();

app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);

app.use((err, req, res, next) => {
  if(err.code === "") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Server Error!');
});

module.exports = app;