const router = require('express').Router();
const { getAllSavedArticles, createArticle, deleteArticle } = require('../controllers/articles');
const { createArticleValidator, deleteArticleValidator } = require('../utils/celebrateValidators');

// returns all articles saved by the current user
router.get('/articles', getAllSavedArticles);

// creates new article
router.post('/articles', createArticleValidator, createArticle);

// deletes article by ID
router.delete('/articles/:articleId', deleteArticleValidator, deleteArticle);

module.exports = router;
