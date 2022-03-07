/* eslint-disable import/extensions */
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { createUser, loginCheckDB } from "./services/userServices.js";
import { transferMoney , getTransactionByUser } from "./services/transServices.js";


// eslint-disable-next-line import/no-extraneous-dependencies



import transRoutes from "./routes/transRoutes.js";

import userRoutes from "./routes/userRoutes.js";


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

app.use("/wallet", transRoutes);
app.use("/wallet", userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const { message } = error;
  const { data } = error;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect("mongodb+srv://Vimannyu:JFzRIEwbqIhI4Y9B@clustervimwallet.5iycf.mongodb.net/walletDatabase?retryWrites=true&w=majority")
  .then((result) => {
    app.listen(PORT);
    console.log(`Application is running at port :- ${PORT}`);
   // createUser('Itachi Uchiha' , 'itachi@sharingan.com' , 'sasukebro' , 3456541223).then((values)=>{console.log(values)} );;
   // createUser('eren jeager' , 'eren@sharingan.com' , 'attacktitan' , 3456541223).then((values)=>{console.log(values)} );;
   //transferMoney(20 , 'Itachi Uchiha' , 'eren jeager'  ).then((values)=>{console.log(values)} );
   //getTransactionByUser('Itachi Uchiha').then((values)=>{console.log(values)} );
   


    
  })
  .catch((err) => console.error(err));
