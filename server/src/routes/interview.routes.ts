import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { updateInterviewSchema } from "../validators/interview.validators";
import { patchInterview, removeInterview } from "../controllers/interview.controller";

const router = Router();

router.use(requireAuth);

router.patch("/:id", validate(updateInterviewSchema), patchInterview);
router.delete("/:id", removeInterview);

export default router;