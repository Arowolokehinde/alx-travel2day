import dotenv from "dotenv";
import connectDB from "../dataAccess/mongoDB.js";
import app from "./app.js";

// Handle uncaughtException
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config/config.env" });

// Bring in the connection string
const DB_CLOUD = process.env.DB_CLOUD.replace(
  "<password>",
  process.env.PASSWORD
);

// Create a port
const port = process.env.PORT || 3000;

// Listen to the port
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  connectDB(DB_CLOUD);
});

// Handle unhandled Rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
