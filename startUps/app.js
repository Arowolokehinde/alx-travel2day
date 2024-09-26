import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
// import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { mountedRoutes } from "./routes.js";
import globalErrorHandler from "../errorHandlers/errorHandler.js";
import swaggerDocs from "../swagger/swaggerDoc.js";

const app = express();
const __dirname = path.resolve();


// Always put at the top of all middlewares
// SET Security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan("dev"));

// Limit request from the same IP address
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "Too many requests from this IP. Please try again in an hour",
// });
// app.use("/api", limiter);

// The body parser, reading data from the body into req.body
app.use(express.json({ limit: "10kb" }));

// The cookie parser; for handling sending cookie to the frontend
app.use(cookieParser());

// app.use((req, res, next) =>
// {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   if (req.method === 'OPTIONS')
//   {
//     return res.sendStatus(200);
//   }
//   next();
// });


// The cross origin resource sharing
const corOptions = cors({
  //   origin: process.env.ORIGIN,
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});
app.use(corOptions);

mountedRoutes(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.all("*", (req, res, next) =>
{
  const err = new Error(`Can't find ${req.originalUrl} in this server!`);
  err.statusCode = 404;
  next(err);
  // next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
