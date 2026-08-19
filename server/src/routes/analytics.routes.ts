import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getAnalyticsSummary } from "../controllers/analytics.controller";

const router = Router();

router.use(requireAuth);
router.get("/", getAnalyticsSummary);

export default router;