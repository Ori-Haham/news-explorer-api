const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const { PORT = 3000 } = process.env;

const { postNewUser, login } = require("./controllers/users");
const { userCredentialsValidator } = require("./middleware/userValidators");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middleware/logger");
const auth = require("./middleware/auth");
const usersRoute = require("./routes/users");
const articalsRoute = require("./routes/articals");

mongoose.connect("mongodb://localhost:27017/newExplorer-db");

app.use(cors());
app.options("*", cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post("/signup", userCredentialsValidator, postNewUser);
app.post("/signin", userCredentialsValidator, login);

app.use(auth);

app.use("/", usersRoute);
app.use("/", articalsRoute);

app.use("*", function (req, res) {
  res.status(404).send({ message: "The requested resource was not found" });
});

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
