const rateLimit = require('express-rate-limit');
const { tooManyRequests } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 25,
  message: {
    message: tooManyRequests,
  },
});

module.exports = limiter;
