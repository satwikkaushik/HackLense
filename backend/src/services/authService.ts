import jwt from "jsonwebtoken";
import { UserInTransit } from "@/types/user";

export async function generateToken(user: UserInTransit): Promise<string> {
  try {
    const SECRET = process.env.JWT_SECRET as string;
    const token = jwt.sign(user, SECRET);

    return Promise.resolve(token);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function verifyToken(token: string) {
  try {
    const SECRET = process.env.JWT_SECRET as string;
    const payload = jwt.verify(token, SECRET);

    return Promise.resolve(payload);
  } catch (err) {
    return Promise.reject(err);
  }
}
