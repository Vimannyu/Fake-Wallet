import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";


// eslint-disable-next-line import/no-extraneous-dependencies
import dotenv from "dotenv";


import transRoutes from "./routes/transRoutes";

import userRoutes from "./routes/userRoutes";
import logger from "./middleware/logger";

dotenv.config({ path: "./config.env" });

const app = express();

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

app.use("/wallet/", transRoutes);
app.use("/wallet/", userRoutes);

app.use((error, req, res, next) => {
  logger.error(error);
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGOOSE_CONNECT)
  .then((result) => {
    app.listen(PORT);
    logger.info(`Application is running at port :- ${PORT}`);
  })
  .catch((err) => logger.error(err));
