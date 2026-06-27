import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware";
import { env } from "./config/env";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1", routes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Real Nest API!");
});

// Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
