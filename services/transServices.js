

import Transaction   from "../models/Transaction";
import User from "../models/User"
import logger from "../middleware/logger";

// Money transfer functionality 
export const transferMoney = async (amount , sender , recipient  ) => {
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

const savedTransaction = await transaction.save();
const Amount  = savedTransaction.amount;
let senderUser = savedTransaction.sender;
let recipientUser = savedTransaction.recipient;

 senderUser = await findOne({ name: senderUser });

 recipientUser = await findOne({ name: recipientUser });

const senderBalance = senderUserMain.bankBalance;
const recipientBalance = recipientUserMain.bankBalance;

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

user.transaction.push(savedTransaction);
await User.save();
return {
  savedTransaction,
  _id: savedTransaction._id.toString(),
  email : savedTransaction.initiator.email,
  createdAt: savedTransaction.createdAt.toISOString(),
  updatedAt: savedTransaction.updatedAt.toISOString(),
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
  });
}
