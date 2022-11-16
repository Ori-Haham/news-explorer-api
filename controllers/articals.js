const Article = require('../models/article');

const {
  BadRequestError,
  NotFoundError,
  NoPermissionError,
} = require('../errors/errorClasses');

module.exports.postNewArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user.token,
  })
    .then((article) => {
      res.send(article);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Validation error'));
      } else {
        next(err);
      }
    });
};

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user.token })
    .orFail(new NotFoundError('No articles found'))
    .then((article) => {
      res.send(article);
    })

    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('No article with matching ID found'))
    .then((article) => {
      if (!article.owner.equals(req.user.token)) {
        throw new NoPermissionError(
          'Forbiden : you have no permission to delete this article',
        );
      }
      article.remove(() => {
        res.send(article);
      });
    })
    .catch(next);
};
