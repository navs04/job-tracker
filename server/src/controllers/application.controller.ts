import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  NotFoundError,
} from "../services/application.service";

export async function getApplications(req: AuthRequest, res: Response) {
  const query = (req as any).validatedQuery ?? {};
  const applications = await listApplications(req.userId!, query);
  res.json(applications);
}

export async function getApplicationById(req: AuthRequest, res: Response) {
  try {
    const application = await getApplication(req.userId!, req.params.id);
    res.json(application);
  } catch (err) {
    handleError(err, res);
  }
}

export async function postApplication(req: AuthRequest, res: Response) {
  const application = await createApplication(req.userId!, req.body);
  res.status(201).json(application);
}

export async function patchApplication(req: AuthRequest, res: Response) {
  try {
    const application = await updateApplication(req.userId!, req.params.id, req.body);
    res.json(application);
  } catch (err) {
    handleError(err, res);
  }
}

export async function removeApplication(req: AuthRequest, res: Response) {
  try {
    await deleteApplication(req.userId!, req.params.id);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}