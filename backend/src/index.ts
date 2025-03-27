import dotenv from "dotenv";
import app from "@/app";
import { connectDB } from "@/services/dbService";
import { connection } from "mongoose";

dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000", 10);
const PROTOCOL = process.env.HTTPS === "true" ? "https" : "http";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hack-lense";

connectDB(MONGO_URI);

connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, HOST, () => {
    console.log(`Server is listening on port ${PROTOCOL}://${HOST}:${PORT}`);
  });
});