const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/NotFoundError');
const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');
const { SECRET_KEY, OK_CREATED_CODE } = require('../utils/constants');

const SECRET_JWT = (process.env.NODE_ENV !== 'production') ? SECRET_KEY : process.env.SECRET_JWT;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return Promise.reject(new ConflictError('User with this email is already exists'));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const userDataResponse = {
        name: user.name, email: user.email, _id: user._id,
      };
      res.status(OK_CREATED_CODE).send({ data: userDataResponse });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // user found
      const token = jwt.sign({ _id: user._id }, SECRET_JWT, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
const getCurrentUserInfo = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      const err = new NotFoundError('User not found');
      throw err;
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports = { createUser, login, getCurrentUserInfo };
