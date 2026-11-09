import { z } from 'zod';
import * as activityService from '../services/activityService.js';
import { getHistory } from '../services/historyService.js';

const submitSchema = z.object({
  profileId: z.string(),
  activityId: z.string(),
  requestId: z.string().min(8),
  minutes: z.coerce.number().int().min(0).max(720).default(0),
  notes: z.string().max(500).optional(),
});

export async function listActivities(req, res) {
  res.json(await activityService.listActivities());
}

export async function submitActivity(req, res) {
  const input = submitSchema.parse(req.body);
  const result = await activityService.submitActivity(input, req.file);
  res.status(result.duplicate ? 200 : 201).json(result);
}

export async function activityHistory(req, res) {
  res.json(await getHistory(req.query));
}
