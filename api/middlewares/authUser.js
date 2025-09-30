import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authUser = async (req, res, next) => {
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        if(decoded.id){
            // req.body.userId = decoded.id;
            req.user = { userId: decoded.id };
        }else{
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        next();
    } catch (error) {
        console.log("Error in auth middleware🚫", error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

export default authUser;