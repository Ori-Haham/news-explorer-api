const router = require("express").Router();
const {
  postNewArticle,
  getArticles,
  deleteArticle,
} = require("../controllers/articals");

const {
  articalValidator,
  articleIdValidator,
} = require("../middleware/articalValidators");

router.post("/articles", articalValidator, postNewArticle);

router.get("/articles", getArticles);

router.delete("/articles/:articleId", articleIdValidator, deleteArticle);

module.exports = router;
