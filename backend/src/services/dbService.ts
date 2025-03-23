import User from "@/schema/users";
import mongoose from "mongoose";
import { CreateUser, LoginUser } from "@/types/user";

export async function signupService(details: CreateUser) {
  try {
    const user = await User.create(details);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function loginService(details: LoginUser) {
  try {
    const user = await User.findOne(details);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user: CreateUser | null = await User.findOne({ email: email });
    if (user !== null) {
      return Promise.resolve(user);
    } else {
      return Promise.resolve(null);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function connectDB(URI: string) {
  try {
    await mongoose.connect(URI);
    return Promise.resolve("Connected to DB");
  } catch (error) {
    return Promise.reject(error);
  }
}
