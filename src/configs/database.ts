import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("[database]: Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};
