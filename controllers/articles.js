const jwt = require('jsonwebtoken');
const Article = require('../models/article');
const IncorrectData = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbiden-error');
const NotAuthorized = require('../errors/not-authorized');
const { notFoundCard } = require('../utils/constants');
const { canNotDeleteCard } = require('../utils/constants');
const { notAuthorized } = require('../utils/constants');
const { incorrectData } = require('../utils/constants');
const { SECRET } = require('../utils/constants');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((cards) => {
      if (!cards) {
        throw new IncorrectData(incorrectData);
      }

      res.send(cards);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new IncorrectData(incorrectData));
      }
      next();
    });
};

module.exports.deleteArticle = (req, res, next) => {
  const { authorization } = req.headers;
  const { articleId } = req.params;

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    next(new NotAuthorized(notAuthorized));
  }

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError(notFoundCard);
      } else if (article.owner.toString() !== payload._id.toString()) {
        throw new Forbidden(canNotDeleteCard);
      }
      Article.findByIdAndRemove(articleId)
        .then((removeCard) => {
          res.send(removeCard);
        })
        .catch(next);
    })
    .catch(next);
};
