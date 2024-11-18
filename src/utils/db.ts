import { PrismaClient } from "@prisma/client";
import { error, log } from "console";

export const prismaClient = new PrismaClient();

export const connectDB = async () => {
  try {
    await prismaClient.$connect();
    log("Database connected successfully via Prisma Client");
  } catch (err) {
    error("Database connection error:", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prismaClient.$disconnect();
  log("Prisma disconnected");
  process.exit(0);
});
