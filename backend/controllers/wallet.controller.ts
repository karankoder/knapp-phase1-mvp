import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { providerService } from "../services/provider.service";
import { ErrorHandler } from "../utils/errorHandler";

export const walletController = {
  /**
   * GET /wallet/:address/balance
   * Retrieves the native balance for a specific address.
   */
  getBalance: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { address } = req.params;

      if (!address) {
        return next(new ErrorHandler("Wallet address is required", 400));
      }

      const balance = await providerService.getNativeBalance(address);

      res.status(200).json({
        status: "success",
        data: {
          address,
          network: "Base Sepolia (Testnet)",
          currency: "ETH",
          balance: balance,
        },
      });
    }
  ),

  /**
   * POST /wallet/connect
   * A compatibility endpoint to acknowledge client-side wallet creation.
   */
  connectWallet: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { address } = req.body;

      if (!address || !providerService.validateAddress(address)) {
        return next(new ErrorHandler("Valid wallet address is required", 400));
      }

      // We might store the public address in the DB here for user tracking.
      // For the phase 1 MVP, we simply acknowledge the connection.

      res.status(200).json({
        status: "success",
        message: "Wallet connected successfully",
        data: { address },
      });
    }
  ),
};
