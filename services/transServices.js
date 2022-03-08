/* eslint-disable import/extensions */

import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// Money transfer functionality
export const transferMoney = async (amount, sender, recipient) => {
  const user = await User.findOne({ name: sender });
  if (!user) {
    console.error("Invalid user.");
  }
  const transaction = new Transaction({
    sender: sender,
    recipient: recipient,
    amount: amount,
    initiator: user,
  });

  

  const savedTransaction = await transaction.save();
  const Amount = savedTransaction.amount;
  let senderUser = savedTransaction.sender;
  let recipientUser = savedTransaction.recipient;

  senderUser = await User.findOne({ name: senderUser });

  recipientUser = await User.findOne({ name: recipientUser });
  

  const senderBalance = senderUser.bankBalance;
  const recipientBalance = recipientUser.bankBalance;

  if (senderBalance <= 0 ){
    return 'User bank balance is empty' ;
    
  }

  let updatedSenderBalance = senderBalance - Amount;
  let updatedRecipientBalance = recipientBalance + Amount;

  // eslint-disable-next-line no-unused-vars
  updatedSenderBalance = await senderUser.updateOne({
    bankBalance: updatedSenderBalance,
  });
  // eslint-disable-next-line no-unused-vars
  updatedRecipientBalance = await recipientUser.updateOne({
    bankBalance: updatedRecipientBalance,
  });
  await senderUser.save();
  await recipientUser.save();

  user.transactionID.push(savedTransaction);
  await user.save();
  return {
    savedTransaction,
    _id: savedTransaction._id.toString(),
    email: savedTransaction.initiator.email,
    createdAt: savedTransaction.createdAt.toISOString(),
    updatedAt: savedTransaction.updatedAt.toISOString(),
  };
};

// User view :- only user can see transaction which was done by them.
export const getTransactionByUser = async (sender) => {
  try {
    const oneuser = await User.findOne({ name: sender });

    const transId = oneuser.transactionID;

    return {
      message: `fetched. Transaction Ids of user ${oneuser.name} `,
      transaction: transId,
    };
  } catch (err) {
    console.log("user cant be found");
  }
};
