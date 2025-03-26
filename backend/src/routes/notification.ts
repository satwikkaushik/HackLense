import express from "express";
import { sendEmail } from "@/controllers/notification";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Notification route");
});

router.post("/send-email", sendEmail);

export default router;
