import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import { priceService } from "../services/price.service";
import { ErrorHandler } from "../utils/errorHandler";

export const priceController = {
  /**
   * GET /price/:tokenId
   * Fetches the current price of a token.
   * Query Params: ?currency=usd (defaults to usd)
   */
  getPrice: catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { tokenId } = req.params;
      const currency = (req.query.currency as string) || "usd";

      if (!tokenId) {
        return next(new ErrorHandler("Token ID is required", 400));
      }

      const price = await priceService.getTokenPrice(
        tokenId.toLowerCase(),
        currency.toLowerCase()
      );

      res.status(200).json({
        status: "success",
        data: {
          tokenId,
          currency,
          price,
          timestamp: new Date().toISOString(),
        },
      });
    }
  ),
};
