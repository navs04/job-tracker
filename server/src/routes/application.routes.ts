import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { createApplicationSchema, updateApplicationSchema } from "../validators/application.validators";
import {
  getApplications,
  getApplicationById,
  postApplication,
  patchApplication,
  removeApplication,
} from "../controllers/application.controller";

const router = Router();

// Every route in this file requires a valid access token
router.use(requireAuth);

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/", validate(createApplicationSchema), postApplication);
router.patch("/:id", validate(updateApplicationSchema), patchApplication);
router.delete("/:id", removeApplication);

export default router;