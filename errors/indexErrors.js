const NotFoundError = require('./NotFoundErr');
const ConflictError = require('./ConflictError');
const BadRequestError = require('./BadRequestError');
const NoPermissionError = require('./NoPermissionError');
const UnauthorizedError = require('./UnauthorizedError');

module.exports = {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  NoPermissionError,
};
