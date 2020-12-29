const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validatorLib = require('validator');
const User = require('../models/user');
const IncorrectData = require('../errors/incorrect-data-error');
const NotFoundError = require('../errors/not-found-error');
const NotAuthorized = require('../errors/not-authorized');
const { userAlreadyRegistered } = require('../utils/constants');
const { dataIncorrect } = require('../utils/constants');
const { notFoundUser } = require('../utils/constants');
const { notAuthorized } = require('../utils/constants');

module.exports.getUserInfo = (req, res, next) => {
  const { authorization } = req.headers;

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorized(notAuthorized));
  }

  User.findById(payload._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUser);
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
        throw new NotAuthorized(dataIncorrect);
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  if (validatorLib.contains(password, ' ')) {
    throw new IncorrectData(dataIncorrect);
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(409).send({ message: userAlreadyRegistered });
      }
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      email, password: hashedPassword, name,
    }))
    .then(() => {
      res.status(200).send({});
    })
    .catch(next);
};
