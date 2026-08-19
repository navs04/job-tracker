import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { getReminders } from "../services/reminders.service";

export async function getRemindersSummary(req: AuthRequest, res: Response) {
  const data = await getReminders(req.userId!);
  res.json(data);
}