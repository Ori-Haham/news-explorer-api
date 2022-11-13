const { celebrate, Segments } = require("celebrate");
const Joi = require("joi").extend(require("@joi/date"));

const validator = require("validator");

const validateUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }

  return helpers.error("string.uri");
};

const articalValidator = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(20),
    title: Joi.string().required().min(2).max(70),
    text: Joi.string().required().min(2).max(100),
    date: Joi.date().format("YYYY-MM-DD").utc(),
    link: Joi.string().required().custom(validateUrl),
    source: Joi.string().required().custom(validateUrl),
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
