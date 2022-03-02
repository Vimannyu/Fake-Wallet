/* eslint-disable import/prefer-default-export */
import bcrypt from "bcryptjs";
import User from "../models/User";
import logger from "../middleware/logger";


export const createUser = async (Name, email, password, phone) => {
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    logger.error("User exists already!");
  }
  const hashedPw = await bcrypt.hash(password, 12);
  const user = new User({
    email: email,
    name: Name,
    password: hashedPw,
    phone: phone,
  });
  const createdUser = await user.save();
  // now sending sending mail to the user on signing up

  return {
    id: createdUser._id.toString(),
    email: createdUser.email,
    user: createdUser,
  };
};

export const loginCheckDB = async (email, password) => {
  const Email = email;
  const Password = password;
  const user = await User.findOne({ email: Email });
  if (!user) {
    logger.error("user doesnt exist , you need to signup");
  
  }
  const isEqual = await bcrypt.compare(Password, user.password);
  if (!isEqual) {
    logger.error("Password is incorrect.");
    
  }
  return {id :user._id.toString() , email : Email}
}