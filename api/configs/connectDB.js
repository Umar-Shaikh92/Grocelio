import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Mongo DB is Connected ✅"));
    await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
    console.log("Error in connecting MongoDB🚫", error);
    }
};
