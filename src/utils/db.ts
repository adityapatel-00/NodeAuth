import { error, log } from "console";
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI!;
  try {
    await mongoose.connect(uri);
    log("MongoDB connected successfully");
  } catch (err) {
    error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
