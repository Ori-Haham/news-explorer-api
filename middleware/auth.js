const jwt = require('jsonwebtoken');
require('dotenv').config();

const {
  JWT_SECRET = `286fbdf86a49634871fcf6c92348bc46e93d22cc06bf22a18662fa7781690acd8f5113973e5bb9375b8990675d3372ac37102a9bfb1ac383d3b43
  fd66780e610`,
} = process.env;
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new UnauthorizedError('Authorization Required');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError('Authorization Required');
  }

  req.user = payload;

  next();
};
