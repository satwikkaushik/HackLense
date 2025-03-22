import dotenv from "dotenv";
import app from "@/app";

dotenv.config();

const HOST = process.env.HOST || "localhost";
const PORT = parseInt(process.env.PORT || "3000", 10);
const PROTOCOL = process.env.HTTPS === "true" ? "https" : "http";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${PROTOCOL}://${HOST}:${PORT}`);
});