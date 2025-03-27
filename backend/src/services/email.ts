import dotenv from "dotenv";
dotenv.config();

import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: parseInt((process.env.SMTP_PORT || "465"), 10),
    secure: (process.env.SMTP_SECURE || "true") === "true" ? true : false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    text: string
): Promise<SentMessageInfo> => {
    try {
        await verifyTransporter();
        
        const mailOptions: SendMailOptions = {
            from: process.env.SMTP_USER as string,
            to,
            subject,
            text,
        };

        const info: SentMessageInfo = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

export const verifyTransporter = async () => {
    try {
        await transporter.verify();
        console.log("Transporter is ready to send emails");
    } catch (error) {
        console.error("Error verifying transporter:", error);
        throw error;
    }
}
