const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const dataRoutes = require("./routes/apiData");
const authRoutes = require("./routes/apiAuth");


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use('/wallet/',dataRoutes);
app.use('/wallet/',authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const {message} = error;
  const {data} = error;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGOOSE_CONNECT)
  .then((result) => {
app.listen(PORT);
    console.log(`Application is running at port :- ${PORT}`);
  })
  .catch((err) => console.log(err));
