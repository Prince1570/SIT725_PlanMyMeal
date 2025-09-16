import { User } from "../models/users.schema.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  try {
    const { username, dateOfBirth, gender, password, email } = req.body;
    const userExists = await User.findOne({ email });

    // check if user already exists
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
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

    return res.json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
