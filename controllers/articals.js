const Article = require("../models/article");
const NotFoundError = require("../errors/notFoundErr");
const BadRequestError = require("../errors/BadRequestError");
const noPermissionError = require("../errors/noPermissionError");

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
      try {
        res.send(article);
      } catch (err) {
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Validation error"));
      } else {
        next(err);
      }
    });
};

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user.token })
    .orFail(new NotFoundError("No articles found"))
    .then((article) => {
      res.send(article);
    })

    .catch(next);
};

module.exports.deleteArticle = (req, res, next) => {
  Article.findByIdAndRemove(req.params.articleId)
    .orFail(new NotFoundError("No article with matching ID found"))
    .then((article) => {
      if (article.owner != req.user.token) {
        throw new noPermissionError(
          "Forbiden : you have no permission to delete this article"
        );
      }
      res.send(article);
    })
    .catch(next);
};
