const {
  celebrate,
  Joi,
} = require('celebrate');

const { errors } = require('celebrate');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const usersRoute = require('./routes/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const articlesRoute = require('./routes/articles');
const NotFoundError = require('./errors/not-found-error');
const { loginUser, createUser } = require('./controllers/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/diploma', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
app.use(errorLogger); // подключаем логгер ошибок

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: true } }),
    password: Joi.string().required().min(8).max(128),
  }),
}), loginUser);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: true } }),
    password: Joi.string().required().min(8).max(128),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

app.use(auth);
// Роутинг
app.use(usersRoute);
app.use(articlesRoute);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err);

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(3000, () => {
  console.log('Сервер использует 3000 порт');
});
