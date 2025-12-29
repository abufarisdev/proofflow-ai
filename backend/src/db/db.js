import mongoose from "mongoose";

function connectDB() {
  return mongoose
    .connect((process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/proofflow-ai").replace("localhost", "127.0.0.1"))
    .then(() => {
      console.log("✅ Mongoose connected");
    })
    .catch((err) => {
      console.error("❌ Mongoose not connected:", err);
      throw err;
    });
}

export default connectDB;
