import { Request, Response } from "express";
import { signupService, findUserByEmail } from "@/services/dbService";
import { CreateUser } from "@/types/user";

export async function accountSignup(req: Request, res: Response) {
  const details: CreateUser = req.body;

  try {
    // checking if user already exists
    const userExists = await findUserByEmail(details.email);
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // creating new user
    const user = await signupService(details);
    res.status(200).json({ message: "User Created", user: user });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
    return;
  }
}

export async function accountLogin(req: Request, res: Response) {
  res.status(200).json({ message: "Login" });
  return;
}

export async function accountLogout(req: Request, res: Response) {
  res.status(200).json({ message: "Logout" });
  return;
}
