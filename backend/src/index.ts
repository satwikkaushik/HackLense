import dotenv from "dotenv";
import app from "@/app";
import { connect } from "mongoose";
import { connectDB } from "@/services/dbService";

dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000", 10);
const PROTOCOL = process.env.HTTPS === "true" ? "https" : "http";
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/hack-lense";

connectDB(MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`);
});
