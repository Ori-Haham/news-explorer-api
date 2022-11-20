const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();

const { PORT = 3000 } = process.env;

const indexRoute = require('./routes/index');

mongoose.connect(`${process.env.DB_ADDRESS}`);
app.use(indexRoute);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
