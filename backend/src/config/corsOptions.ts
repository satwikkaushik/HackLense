import { CorsOptions } from "cors";
import allowedOrigins from "@/config/allowedOrigins";

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins?.includes(origin || "") || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;