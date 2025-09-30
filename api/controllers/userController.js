import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(201).cookie("token", token, {
      httpOnly: true, //prevent JS to access the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    return res.json({
      success: true,
      message: "User Registered Successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.log("Error in User Registration🚫", error);
    res.json({ success: false, message: error.message });
  }
};

//Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({success: false, message: "Missing Details!" });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.json({ success: false, message: "User not found! Please Register." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.json({success: false, message: "Invalid Credentials!" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res.status(201).cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "Logged in Successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    console.log("Error in User Login🚫", error);
    res.status(400).json({ message: error.message });
  }
};

//Check Auth
export const isAuth = async (req, res) => {
  try {
    // const { userId } = req.body;
    const { userId } = req.user;
    const user = await User.findById(userId).select("-password");
    return res.json({ user });
  } catch (error) {
    console.log("Error in isAuth🚫", error);
    res.status(400).json({ message: error.message });
  }
};

//Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(201).json({ success: true, message: "Logged out successfully!" });
  } catch (error) {
    console.log("Error in Logout🚫", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
