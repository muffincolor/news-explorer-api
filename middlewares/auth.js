const jwt = require('jsonwebtoken');
const NotAuthorized = require('../errors/not-authorized');
const { notAuthorized } = require('../utils/constants');
const { SECRET } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    if (typeof authorization !== 'undefined') {
      if (!authorization.startsWith('Bearer ')) {
        next(new NotAuthorized(notAuthorized));
      }
    }
    next(new NotAuthorized(notAuthorized));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    next(new NotAuthorized(notAuthorized));
  }

  req.user = payload;
  next();
};
