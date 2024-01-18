const AuthModel = require("../models/auth");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const existingUser = await AuthModel.findOne({ email });
  if (existingUser) {
    const error = new HttpError("Bu email artiq qeydiyyatdan kecilmisdir", 501);
    return next(error);
  }
  if (!/^[A-Z](?=.*\d)/.test(password)) {
    const error = new HttpError(
      "Parol böyük hərflə başlamalı və ən azı bir rəqəmdən ibarət olmalıdır",
      500
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const createUser = await AuthModel.create({
    name,
    email,
    password: hashedPassword,
  });
  const createUserToken = (user) => {
    return { userId: user._id, email: user.email };
  };
  const userToken = createUserToken(createUser);

  const token = jwt.sign(
    { userId: createUser._id, email: createUser.email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  console.log(token);
  res.status(200).json({ user: userToken, token });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const existingUser = await AuthModel.findOne({ email });
  if (!existingUser) {
    const error = new HttpError("Bu email databazada tapilmadi", 501);
    return next(error);
  }
  const decodePassword = await bcrypt.compare(password, existingUser.password);
  if (!decodePassword) {
    const error = new HttpError("Parol yanlisdir", 501);
    return next(error);
  }
  const createUserToken = (user) => {
    return { userId: user._id, email: user.email };
  };
  const userToken = createUserToken(existingUser);

  const token = jwt.sign(
    { userId: existingUser._id, email: existingUser.email },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.status(200).json({ user: userToken, token });
};

module.exports = {
  register,
  login,
};
