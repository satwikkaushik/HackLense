import { Request, Response } from "express";
import {
  signupService,
  loginService,
  findUserByEmail,
} from "@/services/dbService";
import { CreateUser, LoginUser } from "@/types/user";

export async function accountSignup(req: Request, res: Response) {
  const details: CreateUser = req.body;

  if (
    !details.name ||
    !details.username ||
    !details.email ||
    !details.password ||
    !details.role
  ) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

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
  const details: LoginUser = req.body;
  if (!details.email || !details.password || !details.role) {
    res.status(400).json({ message: "Missing Fields" });
    return;
  }

  try {
    const emailExists = await findUserByEmail(details.email);
    if (!emailExists) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const user = await loginService(details);
    if (user === null) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    res.status(200).json({ message: "Login Successful", user: user });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error });
    return;
  }
}

export async function accountLogout(req: Request, res: Response) {
  res.status(200).json({ message: "Logout" });
  return;
}
