import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";

const router = Router();

router.get("/prices", walletController.getMarketPrices);

router.get("/portfolio", walletController.getMyPortfolio);

export default router;
