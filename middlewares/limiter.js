const rateLimit = require('express-rate-limit');
const { tooManyRequests } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
  message: {
    message: tooManyRequests,
  },
});

module.exports = limiter;
