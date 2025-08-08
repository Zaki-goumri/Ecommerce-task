import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import { seedInitialProducts } from "./services/productService";
import productRoute from "./routes/productsRoute";
import cartRoute from "./routes/cartRoute";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";
import crypto from "crypto";
import { validateJWT } from "./middleware/validateJWT";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined in the environment variables");
}

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

seedInitialProducts();

app.use("/auth", userRoute);
app.use("/products",validateJWT, productRoute);
app.use("/cart",validateJWT, cartRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
