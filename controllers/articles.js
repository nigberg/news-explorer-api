const Article = require('../models/article');
const { OK_CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const BadRequestError = require('../utils/errors/BadRequestError');

const getAllSavedArticles = (req, res, next) => {
  const userId = req.user._id;
  Article.find({ owner: userId })
    .then((articles) => {
      res.send({ data: articles });
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  const owner = req.user._id;
  Article.create({
    keyword, title, text, date, source, link, image, owner,
  })
    .then((article) => {
      const articleDataResponse = {
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
        _id: article._id,
      };
      res.status(OK_CREATED_CODE).send({ data: articleDataResponse });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .select('+owner')
    .orFail(() => {
      const err = new NotFoundError('Article not found');
      throw err;
    })
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        const err = new ForbiddenError('Not allowed');
        throw err;
      }
      return Article.findByIdAndDelete(articleId);
    })
    .then((removedArticle) => {
      res.send({ data: removedArticle });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid ID'));
      } else {
        next(err);
      }
    });
};

module.exports = { getAllSavedArticles, createArticle, deleteArticle };
