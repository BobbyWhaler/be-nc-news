const { selectTopics, selectArticles, selectArticleByID, selectCommentsByArticleID, insertComments, updateArticleByID, selectUsers } = require('../models/nc-news');

exports.getApi = (request, response) => {
    response.status(200).send( {message: "all ok"} );
};
exports.getTopics = (request, response) => {
    selectTopics()
    .then((topics) => {
        response.status(200).send( {topics} );
    });
};
exports.getArticles = (request, response, next) => {
    selectArticles(request.query)
    .then((articles) => {
        response.status(200).send( {articles} );
    })
    .catch(next);
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
exports.patchArticleByID = (request, response, next) => {
    const body = request.body
    const { article_id } = request.params
    updateArticleByID(body, article_id)
    .then((article) => {
        response.status(200).send({ article })})
    .catch(next)
}
exports.getUsers = (request, response) => {
    selectUsers()
    .then((users) => {
        response.status(200).send( {users} );
    });
}