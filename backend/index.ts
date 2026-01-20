import app from "./src/app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4960;
const MONGO_URI: string = process.env.MONGO_URI || "";

mongoose.connect(MONGO_URI).then(() => {
  console.log("\n\nConnected to MongoDB Atlas Successfully!\n\n");

  app.listen(PORT, () => {
  console.log(`\n\nServer is running on port: ${PORT}\n\nHappy Hacking!\n\n`);
});

}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});