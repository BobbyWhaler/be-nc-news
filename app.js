const express = require('express');
const { getApi, getTopics } = require('./controllers/nc-news');
const app = express();
app.use(express.json());
require('dotenv').config();

app.get('/api', getApi);
app.get('/api/topics', getTopics);

 // handles psql errors 
app.use((err, req, res, next) => {
  if(err.code === "") {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});

// handles custom errors
// app.use((err, req, res, next) => {
//   if (err.msg !== undefined) {
//     res.status(err.status).send({ msg: err.msg });
//   } else {
//     next(err);
//   }
// });

// handles server errors
app.use((err, req, res, next) => {
//   console.log(err)
  res.status(500).send('Server Error!');
});

module.exports = app;