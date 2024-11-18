import { Router, Request, Response } from "express";
import { authenticationMiddleware } from "../middleware/authentication.js";
import { prismaClient } from "../utils/db.js";

const userRouter: Router = Router();

userRouter.use(authenticationMiddleware);

userRouter.get("/info", async (req: Request, res: Response): Promise<void> => {
  try {
    const email = res.locals?.email;

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    res.status(200).json({
      message: "Details fetched successfully",
      data: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong, Try again!",
    });
  }
});

export default userRouter;
