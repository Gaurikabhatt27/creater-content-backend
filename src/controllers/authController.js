import { registerUser, loginUser } from "../services/authService.js";
import generateToken from "../utils/generateToken.js";
import { saveOtp } from "../services/otpService.js";
import { sendEmail } from "../sendEmail.js";
import { verifyOtpService } from "../services/otpService.js";
import { generateOtp } from "../services/otpService.js";
export const signup = async (req, res) => {
  try {
    const { user, token } = await registerUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.status(201).json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0)
  });

  res.json({ message: "Logged out" });
};

export const sendOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOtp();
    console.log("otp", otp);
    await saveOtp(email, otp);
    console.log()
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is ${otp}. It expires in 5 minutes.`
    );


    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOtpController = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    await verifyOtpService(email, otp);

    const { user, token } = await registerUser({
      name,
      email,
      password
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import User from "../models/User.js";

export const getMe = async (req, res) => {
  const user = req.user;
  if (user) {
    return res.json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email
    });
  }
  return res.status(401).json({ message: "Not authenticated" });
};

export const getAllUsers = async (req, res) => {
  try {
    // Return all users except the current user
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};