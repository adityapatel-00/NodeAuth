import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";
import connectDB from "./db.js";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

configDotenv();

const app = express();
app.use(express.json());

connectDB();

app.get("/api/v1", (req: Request, res: Response): void => {
  res.json({ message: "Welcome to Authentication by Aditya" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

const port: number = Number(process.env.SERVER_PORT) || 3000;
const start = (): void => {
  try {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
start();
