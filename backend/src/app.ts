import express, { Request, Response } from "express";
import morgan from "morgan";
import accountRoutes from "@/routes/account";

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Hello, TypeScript with Express!");
    return;
});

app.use("/account", accountRoutes);

export default app;