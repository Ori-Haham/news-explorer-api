const bcrypt = require('bcryptjs');
require('dotenv').config();

const {
  JWT_SECRET = `286fbdf86a49634871fcf6c92348bc46e93d22cc06bf22a18662fa7781690acd8f5113973e5bb9375b8990675d3372ac37102a9bfb1ac383d3b43
fd66780e610`,
} = process.env;

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const {
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} = require('../errors/errorClasses');

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
          console.log(err);
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
    .then((user) => {
      return bcryptCompare(password, user);
    })
    .then((user) => {
      const token = jwt.sign({ token: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      const jsonToken = JSON.stringify(token);
      res.send(jsonToken);
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

module.exports.deleteUser = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .orFail(new NotFoundError('No article with matching ID found'))
    .then((article) => {
      res.send(article);
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      throw new NotFoundError('No users found');
    })
    .then((users) => res.send({ users }))
    .catch(next);
};
