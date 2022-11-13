const bcrypt = require("bcryptjs");
require("dotenv").config();
const {
  JWT_SECRET = `286fbdf86a49634871fcf6c92348bc46e93d22cc06bf22a18662fa7781690acd8f5113973e5bb9375b8990675d3372ac37102a9bfb1ac383d3b43
fd66780e610`,
} = process.env;

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const NotFoundError = require("../errors/notFoundErr");
const unauthorizedError = require("../errors/unauthorizedError");
const BadRequestError = require("../errors/BadRequestError");
const conflictError = require("../errors/conflictError");

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
        if (err.name === "ValidationError") {
          next(new BadRequestError("Validation error"));
        } else if (err.name === "MongoServerError") {
          next(new conflictError("This email already exist"));
        } else {
          console.log(err);
          next(err);
        }
      })
  );
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new unauthorizedError("Invalid email or password");
      }
      const token = jwt.sign({ token: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const userId = req.user.token;
  if (!userId) {
    throw new NotFoundError("Please login");
  }
  User.findById(userId)
    .orFail(new NotFoundError("No users found"))
    .then((user) => res.send(user))
    .catch(next);
};
