import { loginUser, registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { username, dateOfBirth, gender, password, email } = req.body;
    const user = await registerUser({
      username,
      dateOfBirth,
      gender,
      password,
      email,
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await loginUser({ password, email });
    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
