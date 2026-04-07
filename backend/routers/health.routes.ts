import { Router } from "express";
import { healthController } from "../controllers/health.controller";

const router = Router();

router.get("/backend", healthController.backendHealth);
router.get("/db", healthController.dbHealth);

export default router;
