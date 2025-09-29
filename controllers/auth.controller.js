import { loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  const { username, dateOfBirth, gender, password, email } = req.body;
  const user = await registerUser({
    username,
    dateOfBirth,
    gender,
    password,
    email,
  });

  return res.json({ user });
};

export const login = async (req, res, next) => {
  const { password, email } = req.body;
  const user = await loginUser({ password, email });
  return res.json({ user });
};
