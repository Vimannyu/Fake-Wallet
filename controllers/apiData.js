/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
const validator = require("validator");

const Transaction = require("../models/Transaction");
const User = require("../models/user");

exports.createTransaction = async function (req, res, next) {
  if (!req.isAuth) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }
  const errors = [];
  if (validator.isEmpty(req.body.from)) {
    errors.push({ message: "Please enter the sender name." });
  }
  if (validator.isEmpty(req.body.to)) {
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
  const user = await User.findById(req.body.sender);
  if (!user) {
    const error = new Error("Invalid user.");
    error.code = 401;
    throw error;
  }
  const transaction = new Transaction({
    sender: req.body.sender,
    recipient : req.body.recipient,
    amount: req.body.amount,
    creator: user,
  });

  const createdTransaction = await transaction.save();
  const {amount} = createdTransaction;
  senderUser = createdTransaction.sender;
  recipientUser = createdTransaction.recipient;

  let senderUser = await User.find({ name: senderUser });

  let recipientUser = await User.find({ name: recipientUser });

  const senderBalance = senderUser.bankBalance;
  const recipientBalance = recipientUser.bankBalance;

 let updatedSenderBalance = senderBalance - amount;
 let updatedRecipientBalance = recipientBalance + amount;

  // eslint-disable-next-line no-unused-vars
  updatedSenderBalance = await User.updateOne({
    bankBalance: updatedSenderBalance,
  });
  updatedRecipientBalance = await User.updateOne({
    bankBalance: updatedRecipientBalance,
  });
  await User.save();

  user.transaction.push(createdTransaction);
  await user.save();
  res.json( {
    createdTransaction,
    _id: createdTransaction._id.toString(),
    createdAt: createdTransaction.createdAt.toISOString(),
    updatedAt: createdTransaction.updatedAt.toISOString(),
  });
  next();
};
exports.getTransaction = (req, res, next) => {
  const {transactionId} = req.params;
  Transaction.findById(transactionId)
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
};
