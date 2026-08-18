import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validate, validateQuery } from "../middleware/validate";
import { createApplicationSchema, updateApplicationSchema } from "../validators/application.validators";
import { listApplicationsQuerySchema } from "../validators/applicationQuery.validators";
import { createInterviewSchema } from "../validators/interview.validators";
import {
  getApplications,
  getApplicationById,
  postApplication,
  patchApplication,
  removeApplication,
} from "../controllers/application.controller";
import { postInterview } from "../controllers/interview.controller";

const router = Router();

router.use(requireAuth);

router.get("/", validateQuery(listApplicationsQuerySchema), getApplications);
router.get("/:id", getApplicationById);
router.post("/", validate(createApplicationSchema), postApplication);
router.patch("/:id", validate(updateApplicationSchema), patchApplication);
router.delete("/:id", removeApplication);

router.post("/:applicationId/interviews", validate(createInterviewSchema), postInterview);

export default router;