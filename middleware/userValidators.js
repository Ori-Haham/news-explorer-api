const { celebrate, Joi, Segments } = require('celebrate');

const userDataValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const loginValidator = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).max(30),
  }),
});

const userIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  userDataValidator,
  loginValidator,
  userIdValidator,
};
