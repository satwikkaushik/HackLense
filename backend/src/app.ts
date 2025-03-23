import express, { Request, Response } from "express";
import morgan from "morgan";
import accountRoutes from "@/routes/account";
import eventRoutes from "@/routes/event";
import rubricRoutes from "@/routes/rubrics";
import cookieParser from "cookie-parser";
import { validateAuthToken } from "./middlewares/validateAuthToken";

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use(validateAuthToken());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
  return;
});

app.use("/account", accountRoutes);
app.use("/event", eventRoutes);
app.use("/rubrics", rubricRoutes);

export default app;
