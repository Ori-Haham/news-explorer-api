const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');

const app = express();

const { PORT = 3000, DB_ADDRESS = 'mongodb://localhost:27017/newExplorer-db' } =
  process.env;

const { postNewUser, login } = require('./controllers/users');
const { userCredentialsValidator } = require('./middleware/userValidators');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const indexRoute = require('./routes/index');
const { NotFoundError } = require('./errors/errorClasses');
const apiLimiter = require('./middleware/apiLimiter');

mongoose.connect(DB_ADDRESS);

app.use(apiLimiter);

app.use(helmet());

app.use(cors());
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', userCredentialsValidator, postNewUser);
app.post('/signin', userCredentialsValidator, login);

app.use(auth);

app.use(indexRoute);

app.use('*', () => {
  throw new NotFoundError('The requested resource was not found');
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
