import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { getRemindersSummary } from "../controllers/reminders.controller";

const router = Router();

router.use(requireAuth);
router.get("/", getRemindersSummary);

export default router;