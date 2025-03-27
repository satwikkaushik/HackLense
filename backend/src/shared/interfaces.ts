import { Request } from "express";
import { UserInTransit } from "@/types/user";

export interface AuthRequest extends Request {
    user?: UserInTransit;
};