const router = require('express').Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('../middleware/logger');
const { postNewUser, login } = require('../controllers/users');
const {
  userDataValidator,
  loginValidator,
} = require('../middleware/userValidators');
const auth = require('../middleware/auth');
const apiLimiter = require('../middleware/apiLimiter');
const { NotFoundError } = require('../errors/indexErrors');

router.use(requestLogger);

router.use(apiLimiter);

router.use(helmet());

router.use(cors());
router.options('*', cors());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/signup', userDataValidator, postNewUser);
router.post('/signin', loginValidator, login);

router.use(auth);

const usersRoute = require('./users');
const articalsRoute = require('./articals');

router.use('/', usersRoute);
router.use('/', articalsRoute);

router.use('*', () => {
  throw new NotFoundError('The requested resource was not found');
});

router.use(errorLogger);
router.use(errors());

router.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

module.exports = router;
