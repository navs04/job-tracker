import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getDashboardSummary } from "../services/dashboard.service";

export async function getDashboard(req: AuthRequest, res: Response) {
  const summary = await getDashboardSummary(req.userId!);
  res.json(summary);
}