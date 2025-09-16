import mongoose, { Schema } from "mongoose";
import { Gender } from "../common/enum/gender.enum.js";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  dateOfBirth: { type: Date, required: false },
  gender: {
    type: String,
    enum: Gender,
    default: Gender.MALE,
  },
  password: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model("User", UserSchema);
