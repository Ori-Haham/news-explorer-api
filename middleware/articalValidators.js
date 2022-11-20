const { celebrate, Segments } = require('celebrate');
const Joi = require('joi').extend(require('@joi/date'));

const validator = require('validator');

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error('string.uri');
};

const articalValidator = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl),
    source: Joi.string().required(),
    image: Joi.string().required().custom(validateUrl),
  }),
});

const articleIdValidator = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  articalValidator,
  articleIdValidator,
};
