import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import medicationRoutes from "./routes/medicationsRoutes.js";
import vitaminRoutes from "./routes/vitamins.js";
import healthProductRoutes from "./routes/healthProductRoutes.js";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/vitamins", vitaminRoutes);
app.use("/api/health-products", healthProductRoutes);
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
