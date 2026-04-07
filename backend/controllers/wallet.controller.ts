import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { walletService } from "../services/wallet.service";

export const walletController = {
  getMyPortfolio: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;

      const portfolio = await walletService.getUserPortfolio(userId);

      res.status(200).json({
        success: true,
        portfolio,
      });
    },
  ),
};
