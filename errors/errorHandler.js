const errorHandler = (err, req, res) => {
  if (err.name === 'CastError' || 'ValidationError') {
    res.status(401).send(err);
    return;
  }
  if (err.statusCode === 404) {
    res.status(404).send(err);
    return;
  }

  res.status(500).send({ message: err });
};

// class BadRequestError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 400;
//   }
// }

// class UnauthorizedError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 401;
//   }
// }

// class ForbiddenError extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 403;
//   }
// }

// module.exports = UnauthorizedError;

// module.exports = ForbiddenError;

module.exports = errorHandler;
