import { User } from "../models/users.schema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (data) => {
  try {
    const { username, dateOfBirth, gender, password, email } = data;
    const userExists = await User.findOne({ email });

    // check if user already exists
    if (userExists) {
      return { msg: "User already exists" };
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
  } catch (error) {
    throw error.message;
  }
};

export const loginUser = async (data) => {
  try {
    const { password, email } = data;
    const SECRET_KEY = "secret_key_12345";
    const userExists = await User.findOne({ email });

    // check if user already exists
    if (!userExists) {
      return { msg: "Invalid credentials." };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const comparePassword = await bcrypt.compare(password, userExists.password);
    if (!comparePassword) {
      throw new BadRequestException(this.i18nService.t("Invalid credentials."));
    }

    const token = jwt.sign(
      { id: userExists._id, email: userExists.email },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    return { message: "Login successful", token };
  } catch (error) {
    return { error: error.message };
  }
};
