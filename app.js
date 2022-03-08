/* eslint-disable node/no-unpublished-import */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import dotenv from "dotenv";
import transRoutes from "./routes/transRoutes.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config({ path: "./config.env" });
const app = express();

mongoose
  .connect(
    "mongodb+srv://Vimannyu:JFzRIEwbqIhI4Y9B@clustervimwallet.5iycf.mongodb.net/walletDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(`DB CONNECTION SUCCESSFUL`);
  })
  .catch((err) => console.error(err));

const port = 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}!!`);
});

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/v1/trans", transRoutes);
app.use("/api/v1/user", userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message: message, data: data });
});
