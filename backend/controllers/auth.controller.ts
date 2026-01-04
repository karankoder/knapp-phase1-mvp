import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { ErrorHandler } from "../utils/errorHandler";

export const authController = {
  register: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { handle, publicAddress, signature, timestamp } = req.body;

      if (!handle || !publicAddress || !signature || !timestamp) {
        throw new ErrorHandler(
          "Please provide handle, publicAddress, signature, and timestamp",
          400
        );
      }

      const { user, token } = await authService.register(
        handle,
        publicAddress,
        signature,
        timestamp
      );

      res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user,
      });
    }
  ),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { publicAddress, signature, timestamp } = req.body;

    if (!publicAddress || !signature || !timestamp) {
      throw new ErrorHandler(
        "Please provide publicAddress, signature, and timestamp",
        400
      );
    }

    const { user, token } = await authService.login(
      publicAddress,
      signature,
      timestamp
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  }),
};
