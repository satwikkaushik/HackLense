import { verifyToken } from "@/services/authService";
import { Response, NextFunction } from "express";
import { UserInTransit } from "@/types/user";
import { generateUserInTransit } from "@/shared/generateInterfaces";
import { AuthRequest } from "@/shared/interfaces";

export function validateAuthToken(cookieName = "authToken") {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userToken = req.cookies[cookieName];
      if (userToken) {
        const payload = await verifyToken(userToken);

        if (payload && typeof payload !== "string") {
          const user: UserInTransit = generateUserInTransit(payload);

          req.user = user;
          console.log("User validated");
        }
      } else {
        throw new Error("No authToken");
      }
    } catch (err) {
      console.error("No authToken");
    } finally {
      next();
    }
  };
}
