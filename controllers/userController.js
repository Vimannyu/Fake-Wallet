
import validator from "validator";
import jwt from "jsonwebtoken";

import crypto from "crypto";
import { emailSender } from "../util/signinMail";


import {
  createUser,
  loginCheckDB,
} from "../services/userServices";
//global key
export const key = crypto.randomBytes(32).toString("hex");

// Created user into the database
export const signup = async function (req, res) {
  const errors = [];
  if (!validator.isEmail(req.body.email)) {
    errors.push({ message: "E-Mail is invalid." });
  }
  if (
    validator.isEmpty(req.body.password) ||
    !validator.isLength(req.body.password, { min: 8 })
  ) {
    errors.push({ message: "Password too short!" });
  }
  if (
    !validator.isLength(req.body.phone, { min: 10 }) ||
    validator.isEmpty(req.body.phone)
  );
  // eslint-disable-next-line no-lone-blocks
  {
    errors.push({ message: "Phone number is invalid" });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }
  const serviceUser = await createUser(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.phone
  );
  if (serviceUser) {
    await emailSender(res.body.email, res.body.name);
  }

  res
    .status(201)
    .json({
      id: serviceUser._id.toString(),
      email: serviceUser.email,
      user: serviceUser.user,
    });
};

export const login = async function (req, res) {
  const DBloginCheck = await loginCheckDB(req.body.email, req.body.password);

  if (DBloginCheck) {
    const token = jwt.sign(
      {
        userId: DBloginCheck.id,
        email: DBloginCheck.email,
      },
      key,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: DBloginCheck.id });
  }
};
