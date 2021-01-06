const rateLimit = require('express-rate-limit');
const { tooManyRequests } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 300,
  message: {
    message: tooManyRequests,
  },
});

module.exports = limiter;
