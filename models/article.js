const mongoose = require('mongoose');
const validatorLib = require('validator');
const { linkIncorrect } = require('../utils/constants');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(string) {
        return validatorLib.isURL(string) && validatorLib.matches(string, /^https?:\/\/w?w?w?\w/g);
      },
      message: linkIncorrect,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(string) {
        return validatorLib.isURL(string) && validatorLib.matches(string, /^https?:\/\/w?w?w?\w/g);
      },
      message: linkIncorrect,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
