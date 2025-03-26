import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "@/config/corsOptions";
import accountRoutes from "@/routes/account";
import eventRoutes from "@/routes/event";
import notificationRoutes from "@/routes/notification";
import submissionRoutes from "@/routes/submission";
import { validateAuthToken } from "@/middlewares/validateAuthToken";
import errorHandler from "@/middlewares/errorHandler";

const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors(corsOptions));

// Log requests to the console
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
  return;
});

app.use(validateAuthToken());

app.use("/account", accountRoutes);
app.use("/event", eventRoutes);
app.use("/submissions", submissionRoutes);
app.use("/notification", notificationRoutes);

// 404 Not Found handler
app.all("*", (req, res) => {
  res.status(404).json({ error: "The requested route could not be found." });
});

app.use(errorHandler);

export default app;
