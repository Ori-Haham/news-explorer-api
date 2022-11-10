const express = require("express");

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors());
app.options("*", cors());

app.use("*", function (req, res) {
  res.status(404).send({ message: "The requested resource was not found" });
});

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
