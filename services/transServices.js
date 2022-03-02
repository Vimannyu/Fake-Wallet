

import Transaction   from "../models/Transaction";
import User from "../models/User"
import {emailFail} from "../util/TransactionFailMail";
import emailSucsessTransfer from "../util/TransactionSuccessMail";
import logger from "../middleware/logger";

// Money transfer functionality 
export const transferMoney = async (amount , sender , recipient , initiator ) => {
const user = await findById(sender);
if (!user) {
  logger.error("Invalid user.");
  
}
const transaction = new Transaction({
  sender: sender,
  recipient: recipient,
  amount: amount,
  initiator: user,
});

const createdTransaction = await transaction.save();
const Amount  = createdTransaction.amount;
let senderUser = createdTransaction.sender;
let recipientUser = createdTransaction.recipient;

 senderUser = await findOne({ name: senderUser });

 recipientUser = await findOne({ name: recipientUser });

const senderBalance = senderUser.bankBalance;
const recipientBalance = recipientUser.bankBalance;

let updatedSenderBalance = senderBalance - Amount;
let updatedRecipientBalance = recipientBalance + Amount;

// eslint-disable-next-line no-unused-vars
updatedSenderBalance = await updateOne({
  bankBalance: updatedSenderBalance,
});
// eslint-disable-next-line no-unused-vars
updatedRecipientBalance = await updateOne({
  bankBalance: updatedRecipientBalance,
});
await senderUser.save();
await recipientUser.save();

const transfersuccessratio = () => {
  const score = Math.floor(Math.random() * 10) + 1;
  if (score > 4) {
    return true;
  } 
    return false;
  
};

if (transfersuccessratio) {
  emailSucsessTransfer(sender, initiator.email , amount);
} else {
  emailFail(sender, initiator.email, amount);
}

user.transaction.push(createdTransaction);
await User.save();
return {
  createdTransaction,
  _id: createdTransaction._id.toString(),
  createdAt: createdTransaction.createdAt.toISOString(),
  updatedAt: createdTransaction.updatedAt.toISOString(),
}
};

// User view :- only user can see transaction which was done by them.
export const getTransactionByUser = async (transactionId) => {
const  transId  = transactionId;
 await findById(transId)
  .then((transaction) => {
    if (!transaction) {
      const error = ("Could not find transaction.");
      logger.error(error);
    
    }
    return{ message: "fetched.", transaction: Transaction };
  })
  .catch((err) => {
    if (!err) {
      logger.info('Getting user related transaction');
    }
    // eslint-disable-next-line no-undef
    next(err);
  });
}
