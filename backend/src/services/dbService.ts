import User from "@/schema/users";
import mongoose from "mongoose";
import { CreateUser } from "@/types/user";

export async function signupService(details: CreateUser) {
  try {
    const user = await User.create(details);
    return Promise.resolve(user);
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user: CreateUser[] | null = await User.findOne({ email: email });
    if (user === null || user.length === 0) {
      return Promise.resolve(false);
    } else {
      return Promise.resolve(true);
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
