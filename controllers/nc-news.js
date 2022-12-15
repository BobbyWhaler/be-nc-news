const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleID, insertComments } = require('../models/nc-news');

exports.getApi = (request, response) => {
    response.status(200).send( {message: "all ok"} );
};
exports.getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send( {topics} );
    });
};
exports.getArticles = (request, response) => {
    selectArticles()
    .then((articles) => {
        response.status(200).send( {articles} );
    });
};
exports.getArticleByID = (request, response, next) => {
    const { article_id } = request.params;
    selectArticleByID(article_id)
    .then((article) => { response.status(200).send({ article })})
    .catch(next);
}
exports.getCommentsByID = (request, response, next) => {
    const { article_id } = request.params
    selectCommentsByArticleID(article_id)
    .then((comments) => { response.status(200).send({ comments })})
    .catch(next)
}
exports.postComment = (request, response, next) => {
    const body = request.body
    const { article_id } = request.params
    insertComments(body, article_id)
    .then((comment) => {
        response.status(201).send({ comment })})
        .catch(next)
}