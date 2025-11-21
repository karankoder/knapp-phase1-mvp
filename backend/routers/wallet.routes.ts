import { Router } from "express";
import { walletController } from "../controllers/wallet.controller";

const router = Router();

router.post("/connect", walletController.connectWallet);

router.get("/:address/balance", walletController.getBalance);

export default router;
