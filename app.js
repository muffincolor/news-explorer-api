const {
  celebrate,
  Joi,
} = require('celebrate');
const { errors } = require('celebrate');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const mainRoute = require('./routes/index');
const NotFoundError = require('./errors/not-found-error');
const limiter = require('./middlewares/limiter');
const { notFoundPage } = require('./utils/constants');
const { handleServerError } = require('./errors/server-error');
const { loginUser, createUser } = require('./controllers/users');

dotenv.config({ path: './vars.env' });

const app = express();

app.listen(3000);

mongoose.connect(process.env.DATABASE_ADRESS ? process.env.DATABASE_ADRESS : 'mongodb://localhost:27017/diploma', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(requestLogger); // подключаем логгер запросов
app.use(errorLogger); // подключаем логгер ошибок

app.use(limiter);

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
app.use(mainRoute);

app.use((req, res, next) => {
  next(new NotFoundError(notFoundPage));
});

app.use(errors()); // обработчик ошибок celebrate

app.use(handleServerError);
