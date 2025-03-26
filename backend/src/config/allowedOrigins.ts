import dotenv from "dotenv";

dotenv.config();

const allowedOriginsString: string = process.env.ALLOWED_ORIGINS ?? "";

const allowedOrigins: string[] = allowedOriginsString
  .split(",")
  .map((origin) => origin.trim());

export default allowedOrigins;
