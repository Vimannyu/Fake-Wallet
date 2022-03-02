
import bcrypt from 'bcryptjs'

import validator from "validator";

import jwt from 'jsonwebtoken'

import crypto from "crypto";
import User from "../models/User" ;

import {emailSender} from  "../util/signinMail";

export const key = crypto.randomBytes(32).toString('hex');


// Created user into the database
export const createUser = async function (req, res) {
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
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    const error = new Error("User exists already!");
    throw error;
  }
  const hashedPw = await bcrypt.hash(req.body.password, 12);
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: hashedPw,
    phone: req.body.phone,
  });
  const createdUser = await user.save();
  // now sending sending mail to the user on signing up

  await emailSender(user.email, user.name);

  res
    .status(201)
    .json({ id: user._id.toString(), email: user.email, user: createdUser });
};

export const login = async function (req, res, next) {
  const { email } = req.body;
  const { password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = new Error("User not found.");
    error.code = 401;
    throw error;
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const error = new Error("Password is incorrect.");
    error.code = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    key ,
    { expiresIn: "1h" }
  );
  res.status(200).json({ token: token, userId: user._id.toString() });
};
