import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getAnalytics } from "../services/analytics.service";

export async function getAnalyticsSummary(req: AuthRequest, res: Response) {
  const data = await getAnalytics(req.userId!);
  res.json(data);
}