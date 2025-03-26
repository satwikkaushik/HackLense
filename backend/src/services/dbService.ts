import User from "@/schema/users";
import mongoose from "mongoose";
import { CreateUser, LoginUser } from "@/types/user";

export async function signupService(details: CreateUser) {
  return User.create(details);
}

export async function loginService(details: LoginUser) {
  return User.findOne(details);
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function connectDB(URI: string) {
  try {
    await mongoose.connect(URI);
    return Promise.resolve("Connected to DB");
  } catch (error) {
    return Promise.reject(error);
  }
}
