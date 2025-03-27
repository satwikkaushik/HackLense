// filepath: /home/satwikkaushik/HackLense/backend/src/types/express.d.ts
import { UserInTransit } from "@/types/user";
console.log("express.d.ts loaded");
declare global {
  namespace Express {
    interface Request {
      user?: UserInTransit;
    }
  }
}
