const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET = 'dev-secret' } = process.env;
const { UnauthorizedError } = require('../errors/indexErrors');

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
