import { Router } from "express";
import { transactionController } from "../controllers/transaction.controller";

const router = Router();

router.post("/simulate", transactionController.simulateSend);

router.get("/swap-quote", transactionController.getSwapQuote);

export default router;
