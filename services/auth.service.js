import { User } from "../models/users.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (data) => {
  const { username, dateOfBirth, gender, password, email } = data;
  const userExists = await User.findOne({ email });

  // check if user already exists
  if (userExists) {
    throw new Error("User already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // save user
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
    dateOfBirth,
    gender,
  });
  await newUser.save();

  return { msg: "User registered successfully" };
};

export const loginUser = async (data) => {
  const { password, email } = data;
  const SECRET_KEY = process.env.SECRET_KEY;
  const userExists = await User.findOne({ email });

  // check if user already exists
  if (!userExists) {
    throw new Error("Invalid credentials.");
  }
  const comparePassword = await bcrypt.compare(password, userExists.password);
  if (!comparePassword) {
    throw new Error("Invalid credentials.");
  }

  const token = jwt.sign(
    { id: userExists._id, email: userExists.email },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  return { message: "Login successful", token };
};
