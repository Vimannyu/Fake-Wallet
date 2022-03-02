import { isEmpty } from "validator";
import { transferMoney, getTransactionByUser } from "../services/transServices";
import { emailFail } from "../util/TransactionFailMail";
import emailSucsessTransfer from "../util/TransactionSuccessMail";

export async function createTransaction(req, res) {
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

  const createdTransaction = await transferMoney(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  if (createdTransaction) {
    await emailSucsessTransfer(
      createdTransaction.email,
      req.body.sender,
      req.body.amount
    );
  } else {
    emailFail(createdTransaction.email, req.body.sender, req.body.amount);
  }

  res.json({
    createdTransaction,
    _id: createdTransaction._id.toString(),
    createdAt: createdTransaction.createdAt.toISOString(),
    updatedAt: createdTransaction.updatedAt.toISOString(),
  });
}

// User view :- only user can see transaction which was done by them.
export async function getTransaction(req, res) {
  const getUserViewTransaction = await getTransactionByUser(req.param);

  if (getUserViewTransaction) {
    res.json({ userTransaction: getUserViewTransaction.transaction });
  } else {
    res.json({ Message: " No transaction registered cant fetch abny" });
  }
}
