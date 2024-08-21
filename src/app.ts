import express, { NextFunction, Request, Response } from "express";
const app = express();
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import router from "./routes";
import cookieParser from "cookie-parser";

// parsers ( middleware )
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["http://localhost:5173"] }));

// routes moddleware
app.use("/api/v1", router);

app.use("/", async (req: Request, res: Response) => {
  Promise.reject();
});

// not found route
app.use(notFound);

// global middleware handlers
app.use(globalErrorHandler);

export default app;
