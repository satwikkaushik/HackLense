import { sendEmail as sendEmailService } from "@/services/email";
import EmailLog from "@/schema/emailLog";
import dotenv from "dotenv";
import { Email as EmailInterface } from "@/types/email";

dotenv.config();

export async function sendEmail(params: EmailInterface) {
  try {
    if (!params.email || !params.subject || !params.text) {
      throw new Error("Missing Fields");
    }

    let status: "sent" | "failed" = "sent";
    let errorMessage: string | null = null;

    try {
      await sendEmailService(params.email, params.subject, params.text);
    } catch (error: any) {
      console.error("Email sending failed:", error);
      status = "failed";
      errorMessage = error.message || "Unknown error";
    }

    await EmailLog.create({
      userEmail: params.email,
      subject: params.subject,
      text: params.text,
      status: status,
      error: errorMessage,
    });

    if (status === "failed") {
      throw new Error("Email sending failed");
    }

    return Promise.resolve("Email sent successfully");
  } catch (error) {
    console.log("Error in Email: ", error);
    return Promise.reject(error);
  }
}
