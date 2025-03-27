import {
  accountLogin,
  accountLogout,
  accountSignup,
} from "@/controllers/account";
import { Router } from "express";

const router = Router();

router.post("/login", accountLogin);

router.post("/signup", accountSignup);

router.post("/logout", accountLogout);

export default router;
