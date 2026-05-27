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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
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
