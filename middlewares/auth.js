const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/not-authorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    if (typeof authorization !== 'undefined') {
      if (!authorization.startsWith('Bearer ')) {
        next(new NotAuthorized('Необходима авторизация'));
      }
    }
    next(new NotAuthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new NotAuthorized('Необходима авторизация'));
  }

  req.user = payload;
  next();
};
