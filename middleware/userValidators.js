const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const userCredentialsValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30),
  }),
});

const avatarValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.error('string.uri');
      }),
  }),
});

const updateUserDataVlidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const userIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  userCredentialsValidator,
  updateUserDataVlidator,
  avatarValidator,
  userIdValidator,
};
