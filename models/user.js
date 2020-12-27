const mongoose = require('mongoose');
const validatorLib = require('validator');
const bcrypt = require('bcryptjs');
const { emailIncorrect } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(string) {
        return validatorLib.isEmail(string);
      },
      message: emailIncorrect,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return null;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return null;
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
