import { Router, Request, Response } from "express";
import { authenticationMiddleware } from "../middleware/authentication.js";
import User from "../model/user.js";

const userRouter: Router = Router();

userRouter.use(authenticationMiddleware);

userRouter.get("/info", async (req: Request, res: Response): Promise<void> => {
  try {
    const email = res.locals?.email;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({
        message: "Invalid User",
      });
      return;
    }

    res.status(200).json({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong, Try again!",
    });
  }
});

export default userRouter;
