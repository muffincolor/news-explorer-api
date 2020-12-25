const articlesRouter = require('express').Router();
const {
  celebrate,
  Joi,
} = require('celebrate');
const auth = require('../middlewares/auth');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articlesRouter.get('/articles', auth, getArticles);

articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(40),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().regex(/^https?:\/\/w?w?w?\w/),
    image: Joi.string().required().regex(/^https?:\/\/w?w?w?\w/),
  }),
}), auth, createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().required().length(24).hex(),
  }),
}), auth, deleteArticle);

module.exports = articlesRouter;
