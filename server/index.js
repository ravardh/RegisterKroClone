import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/authRoutes.js";
import AdminRoutes from "./src/routes/adminRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Example route
app.use("/auth", AuthRoutes);
app.use("/admin", AdminRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
