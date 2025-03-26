import { Request, Response, NextFunction } from "express";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    // Log the error stack to the console for debugging purposes
    console.error(err.stack);

    res.status(500).json({
        error: "Internal Server Error",
        name: err.name,
        message: err.message,
    });
    return;
};

export default errorHandler;