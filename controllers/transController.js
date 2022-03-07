/* eslint-disable import/extensions */
import validator from "validator";
import {
  transferMoney,
  getTransactionByUser,
} from "../services/transServices.js";
import { emailFail } from "../util/TransactionFailMail.js";
import emailSucsessTransfer from "../util/TransactionSuccessMail.js";

export async function createTransaction(req, res , next) {
 
  const errors = [];
  if (validator.isEmpty(req.body.sender)) {
    errors.push({ message: "Please enter the sender name." });
  }
  if (validator.isEmpty(req.body.recipient)) {
    errors.push({ message: "PLease enter reciepient name." });
  }

  if (
    validator.isEmpty(req.body.amount) ||
    req.body.amount > 100 ||
    !Math.sign(req.body.amount)
  ) {
    errors.push({ message: "PLease enter valid amount." });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }

  const createdTransaction = await transferMoney(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );
  try {
    if (createdTransaction) {
      await emailSucsessTransfer(req.body.sender, req.body.amount);
    } else {
      await emailFail(req.body.sender, req.body.amount);
    }
  } catch (err) {
    console.log("problem in email server");
  }
  res.json({
    createdTransaction,
    _id: createdTransaction._id.toString(),
    createdAt: createdTransaction.createdAt.toISOString(),
    updatedAt: createdTransaction.updatedAt.toISOString(),
  });
  next();
}

// User view :- only user can see transaction which was done by them.
export async function getTransaction(req, res , next) {
  const getUserViewTransaction = await getTransactionByUser(req.body.sender);

  if (getUserViewTransaction) {
    res.json({ userTransaction: getUserViewTransaction });
  } else {
    res.json({ Message: " No transaction registered cant fetch abny" });
    
  }
  next();
}
