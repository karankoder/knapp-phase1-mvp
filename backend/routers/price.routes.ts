import { Router } from "express";
import { priceController } from "../controllers/price.controller";

const router = Router();

router.get("/:tokenId", priceController.getPrice);

export default router;
