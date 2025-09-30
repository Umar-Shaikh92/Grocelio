import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing Details!" });
    }

    if (
      email === process.env.SELLER_EMAIL &&
      password === process.env.SELLER_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_KEY, {
        expiresIn: "1d",
      });

      res.cookie("sellerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      return res.json({ message: "Seller Logged In Successfully" });
    } else {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export const isSellerAuth = async (req, res) => {
  try {
    const seller = req.seller; // 👈 ab available hai
    if (!seller) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ seller });
    // return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in Seller Auth🚫", error);
    res.status(400).json({ message: error.message });
  }
};

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(201).json({ message: "Seller Logged out successfully!" });
  } catch (error) {
    console.log("Error in Logout🚫", error);
    res.status(400).json({ message: error.message });
  }
};
