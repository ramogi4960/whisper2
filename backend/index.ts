import app from "./src/app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4960;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chat_db";

mongoose.connect(MONGO_URI).then(() => {
  console.log("\n\nConnected to MongoDB Atlas Successfully!");

  app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}\n\nHappy Hacking!`);
});

}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});