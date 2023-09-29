import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import morgan from "morgan";

// Connect DB
import connectDB from "./database/connect.js";

// Routers
import cartRouter from "./routers/cartRouter.js";
import orderRouter from "./routers/orderRouter.js";
import productRouter from "./routers/productRouter.js";
import productTypeRoute from "./routers/productTypeRoute.js";
import reviewRouter from "./routers/reviewRouter.js";
import userRouter from "./routers/userRouter.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();

connectDB(MONGODB_URL);

// Middleware
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

// Use Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/productType", productTypeRoute);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
