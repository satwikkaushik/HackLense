import { verifyToken } from "@/services/authService";
import { Request, Response, NextFunction } from "express";
import { UserInTransit } from "@/types/user";
import { generateUserInTransit } from "@/shared/generateInterfaces";

// extending request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserInTransit;
    }
  }
}

export function validateAuthToken(cookieName = "authToken") {
  return async (req: Request, res: Response, next: NextFunction) => {
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
