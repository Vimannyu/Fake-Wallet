const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = async function (req, res, next) {

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
  res.status(201).json({id: user._id , email : user.email , user : createdUser } );

  next();
};

exports.login = async function (req, res, next) {
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
    "somesupersecretsecret",
    { expiresIn: "1h" }
  );
  res.end('hello world');
  res.status(200).json({ token: token, userId: user._id.toString() });
  next();
};