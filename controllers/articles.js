const jwt = require('jsonwebtoken');
const Article = require('../models/article');
const IncorrectData = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbiden-error');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
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
        throw new IncorrectData('Переданы некорректные данные');
      }

      res.send(cards);
    })
    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  const { authorization } = req.headers;
  const { articleId } = req.params;

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new IncorrectData('Необходима авторизация'));
  }

  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      } else if (article.owner.toString() !== payload._id.toString()) {
        throw new Forbidden('Вы не можете удалить карточку другого пользователя');
      }
      Article.findByIdAndRemove(articleId)
        .then((removeCard) => {
          res.send(removeCard);
        })
        .catch(next);
    })
    .catch(next);
};
