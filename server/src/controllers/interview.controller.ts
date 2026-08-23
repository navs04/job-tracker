import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { createInterview, updateInterview, deleteInterview, NotFoundError } from "../services/interview.service";

export async function postInterview(req: AuthRequest, res: Response) {
  try {
    const interview = await createInterview(req.userId!, String(req.params.applicationId), req.body);
    res.status(201).json(interview);
  } catch (err) {
    handleError(err, res);
  }
}

export async function patchInterview(req: AuthRequest, res: Response) {
  try {
    const interview = await updateInterview(req.userId!, String(req.params.id), req.body);
    res.json(interview);
  } catch (err) {
    handleError(err, res);
  }
}

export async function removeInterview(req: AuthRequest, res: Response) {
  try {
    await deleteInterview(req.userId!, String(req.params.id));
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