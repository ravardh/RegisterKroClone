import dotenv from "dotenv";
dotenv.config();
import dns from "dns";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/authRoutes.js";
import AdminRoutes from "./src/routes/adminRoutes.js";
import PublicRoutes from "./src/routes/publicRoutes.js";
import RmRoutes from "./src/routes/rmRoutes.js";
import ServiceRoutes from "./src/routes/serviceRoutes.js";
import BloggerRoutes from "./src/routes/bloggerRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taxprosolution.co.in",
      "https://www.taxprosolution.co.in",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/auth", AuthRoutes);
app.use("/admin", AdminRoutes);
app.use("/services", ServiceRoutes);
app.use("/public", PublicRoutes);
app.use("/rm", RmRoutes);
app.use("/blogger", BloggerRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  const statusCode = err.statusCode || err.status || (err.type === "entity.too.large" ? 413 : 500);
  const message =
    err.type === "entity.too.large"
      ? "Request payload is too large. Please reduce content/file size."
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

import { validateEnv } from "./src/config/validateEnv.js";

const PORT = process.env.PORT || 5000;

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Server startup failed:", e.message);
    process.exit(1);
  }
};

startServer();
