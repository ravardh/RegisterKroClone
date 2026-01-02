import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./src/config/db.js";

import AuthRoutes from "./src/routes/authRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example route
app.use("/auth", AuthRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
