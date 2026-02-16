const User = require("../../models/user.model");
const { hashPassword, comparePassword } = require("../../utils/hash");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwt");
const bcrypt = require("bcryptjs");

exports.register = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) throw new Error("Email already exists");

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  });

  return user;
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { accessToken, refreshToken };
};
