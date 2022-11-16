const mongoose = require('mongoose');

const emailValidator = {
  validator: function validatorFunction(v) {
    return /https?:\/\/(www\.)?\S+\.(\S+)?/i.test(v);
  },
  message: (props) => `${props.value} is not a valid address!`,
};

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  image: {
    type: String,
    required: true,
    validate: emailValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
