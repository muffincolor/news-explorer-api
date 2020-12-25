const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectData = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.getUserInfo = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new IncorrectData('Необходима авторизация'));
  }

  User.findById(payload._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new IncorrectData('Проверьте правильность введенных данных');
      }

      const token = jwt.sign({ _id: user._id }, 'super-strong-secret');
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: 'Данный пользователь уже зарегистрирован' });
      }
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      email, password: hashedPassword, name,
    }))
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
};
