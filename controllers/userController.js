/* eslint-disable import/extensions */

import validator from 'validator';
import jwt from 'jsonwebtoken';

import { emailSender } from '../util/signinMail.js';

import { createUser, loginCheckDB } from '../services/userServices.js';


// Created user into the database
export const signup = async function (req, res, next) {
  const errors = [];
  if (!validator.isEmail(req.body.email)) {
    errors.push({ message: 'E-Mail is invalid.' });
  }
  if (
    validator.isEmpty(req.body.password) ||
    !validator.isLength(req.body.password, { min: 8 })
  ) {
    errors.push({ message: 'Password too short!' });
  }
  
  if (errors.length > 0) {
    const error = new Error('Invalid input.');
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
  try {
    if (serviceUser) {
       emailSender(res.body.email, res.body.name);
    }
  } catch (err) {
    console.log('problem in email server');
  }
  res.status(201).json({
    id: serviceUser._id,
    email: serviceUser.email,
    user: serviceUser.user,
  });
  next();
};



export const login = async function (req, res, next) {
  const DBloginCheck = await loginCheckDB(req.body.email, req.body.password);

  if (DBloginCheck) {
    const token = jwt.sign(
      {
        userId: DBloginCheck.id,
        email: DBloginCheck.email,
      },
      'tokenkeytoken',
      { expiresIn: '1h' }
    );
    res.status(200).json({ token: token, userId: DBloginCheck.id });
  }
  next();
};
