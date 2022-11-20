const bcrypt = require('bcryptjs');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret' } = process.env;

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors/indexErrors');

function bcryptCompare(password, user) {
  return bcrypt.compare(password, user.password).then((matched) => {
    if (!matched) {
      return Promise.reject(
        new UnauthorizedError('Incorrect email or password'),
      );
    }
    return user;
  });
}

module.exports.postNewUser = (req, res, next) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        const { password, ...userObj } = user._doc;
        res.send(userObj);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Validation error'));
        } else if (err.name === 'MongoServerError') {
          next(new ConflictError('This email already exist'));
        } else {
          next(err);
        }
      }),
  );
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .orFail(new UnauthorizedError('Incorrect email or password'))
    .select('+password')
    .then((user) => bcryptCompare(password, user))
    .then((user) => {
      const token = jwt.sign({ token: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user.token;
  User.findById(userId)
    .orFail(new NotFoundError('No users found'))
    .then((user) => {
      const { password, _id, ...userObj } = user._doc;
      res.send(userObj);
    })
    .catch(next);
};
