import express from "express";
import env from "./config/env.js";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import ratelimit from "express-rate-limit";

const app = express();

app.use(cors({ origin: env.ALLOWED_ORIGINS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", async (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use(helmet());
app.use(compression());
app.use(
  ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later." },
  }),
);

import authRoutes from "./routes/auth.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import userRoutes from "./routes/user.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import winningRoutes from "./routes/winning.routes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/winnings", winningRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.stack || err.message);

  if (err?.type === "entity.too.large" || err?.status === 413) {
    return res.status(413).json({
      success: false,
      message: "Voice payload is too large. Please record a shorter command.",
    });
  }

  // ✅ Handle your ApiError
  if (err.name === "ApiError") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
      ...(err.data && { data: err.data }),
    });
  }

  // ✅ Handle validation errors (if using express-validator)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message:
        "Validation failed. Required fields might be missing or incorrect.",
      errors: err.errors,
    });
  }

  // ✅ Handle Mongoose errors
  if (err.name === "MongoError" || err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Generic server errors
  res.status(500).json({
    success: false,
    message: "Something went wrong! Please try again later.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
