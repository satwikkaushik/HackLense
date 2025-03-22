import { Request, Response } from 'express';

export const accountLogin = (req: Request, res: Response) => {
    res.status(200).json({ message: "Login" });
    return;
}

export const accountSignup = (req: Request, res: Response) => {
    res.status(200).json({ message: "Signup" });
    return;
}

export const accountLogout = (req: Request, res: Response) => {
    res.status(200).json({ message: "Logout" });
    return;
}