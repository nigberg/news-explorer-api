const router = require('express').Router();
const { getAllSavedArticles, createArticle, deleteArticle } = require('../controllers/articles')

// returns all articles saved by the current user
router.get('/articles', getAllSavedArticles);

// creates new article
router.post('/articles', createArticle);

// deletes article by ID
router.delete('/articles/:articleId', deleteArticle);



module.exports = router;