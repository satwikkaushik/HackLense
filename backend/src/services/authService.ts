import jwt from "jsonwebtoken";
import { UserInTransit } from "@/types/user";

const SECRET = process.env.JWT_SECRET as string;

export function generateToken(user: UserInTransit): string {
  return jwt.sign(user, SECRET);
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
