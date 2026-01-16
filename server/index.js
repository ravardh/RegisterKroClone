import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/authRoutes.js";
import AdminRoutes from "./src/routes/adminRoutes.js";
import PublicRoutes from "./src/routes/publicRoutes.js";
import RmRoutes from "./src/routes/rmRoutes.js";
import ServiceRoutes from "./src/routes/serviceRoutes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taxprosolution.co.in/api",
      "https://www.taxprosolution.co.in/api",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Routes
app.use("/auth", AuthRoutes);
app.use("/admin", AdminRoutes);
app.use("/services", ServiceRoutes);
app.use("/public", PublicRoutes);
app.use("/rm", RmRoutes);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
