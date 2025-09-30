import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_KEY);
    if (decoded.email === process.env.SELLER_EMAIL) {
      // need to check
            req.seller = { email: decoded.email };
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (error) {
    console.log("Error in auth middleware🚫", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authSeller;