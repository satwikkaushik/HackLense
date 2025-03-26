import { Request, Response } from "express";
import { sendEmail as sendEmailService } from "@/services/email";
import EmailLog from "@/schema/emailLog";
import dotenv from "dotenv";

dotenv.config();

export async function sendEmail(req: Request, res: Response) {
  try {
    const { email, subject, text } = req.body;
    if (!email || !subject || !text) {
      res.status(400).json({ message: "Please provide all the fields" });
      return;
    }

    let status: "sent" | "failed" = "sent";
    let errorMessage: string | null = null;

    try {
      await sendEmailService(email, subject, text);
    } catch (error: any) {
      console.error("❌ Email sending failed:", error);
      status = "failed";
      errorMessage = error.message || "Unknown error";
    }

    await EmailLog.create({
      userEmail: email,
      subject,
      text,
      status,
      error: errorMessage,
    });
    if (status === "failed") {
      res.status(500).json({ message: "Failed to send email" });
      return;
    }

    res.status(200).json({ message: "Email sent successfully" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error in sending email" });
    return;
  }
}
