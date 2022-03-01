/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { isEmpty } from "validator";

import Transaction, { findById } from "../models/Transaction";
import { findById as _findById, findOne, updateOne, save } from "../models/user";
import default from "../util/TransactionSuccesMail";
const { emailSucsessTransfer } = default;
import _default from "../util/TransactionFailMail";
const { emailFail } = _default;

export async function createTransaction (req, res, next) {

  
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }
  const errors = [];
  if (isEmpty(req.body.sender)) {
    errors.push({ message: "Please enter the sender name." });
  }
  if (isEmpty(req.body.recipient)) {
    errors.push({ message: "PLease enter reciepient name." });
  }

  if (
    isEmpty(req.body.amount) ||
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
  const user = await _findById(req.body.sender);
  if (!user) {
    const error = new Error("Invalid user.");
    error.code = 401;
    throw error;
  }
  const transaction = new Transaction({
    sender: req.body.sender,
    recipient : req.body.recipient,
    amount: req.body.amount,
    initiator: user,
  });

  const createdTransaction = await transaction.save();
  const {amount} = createdTransaction;
  senderUser = createdTransaction.sender;
  recipientUser = createdTransaction.recipient;

  let senderUser = await findOne({ name: senderUser });

  let recipientUser = await findOne({ name: recipientUser });

  const senderBalance = senderUser.bankBalance;
  const recipientBalance = recipientUser.bankBalance;

 let updatedSenderBalance = senderBalance - amount;
 let updatedRecipientBalance = recipientBalance + amount;

  // eslint-disable-next-line no-unused-vars
  updatedSenderBalance = await updateOne({
    bankBalance: updatedSenderBalance,
  });
  updatedRecipientBalance = await updateOne({
    bankBalance: updatedRecipientBalance,
  });
  await senderUser.save();
  await recipientUser.save()

  const transfersuccessratio = () => {
    let score = Math.floor(Math.random() * 10) + 1 ;
    if (score > 4) {
     return true
    }
    else{
      return false
    }
  };

  if (transfersuccessratio)
  {
    emailSucsessTransfer(req.body.sender , user.email , req.body.amount);
  }
 else 
 {
emailFail(req.body.sender , user.email , req.body.amount);
 }





  user.transaction.push(createdTransaction);
  await user.save();
  res.json( {
    createdTransaction,
    _id: createdTransaction._id.toString(),
    createdAt: createdTransaction.createdAt.toISOString(),
    updatedAt: createdTransaction.updatedAt.toISOString(),
  });

}
export function getTransaction(req, res, next) {
  const {transactionId} = req.params;
  findById(transactionId)
    .then((transaction) => {
      if (!transaction) {
        const error = new Error("Could not find transaction.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "fetched.", transaction: Transaction });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
