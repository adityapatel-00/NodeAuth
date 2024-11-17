import { configDotenv } from "dotenv";
import express, { Request, Response } from "express";

configDotenv();

const app = express();
app.use(express.json());

app.get("/api/v1", (req: Request, res: Response): void => {
  res.json({ message: "Welcome to Authentication by Aditya" });
});

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
