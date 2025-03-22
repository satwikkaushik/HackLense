import express, { Request, Response } from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Hello, TypeScript with Express!");
    return;
});

export default app;