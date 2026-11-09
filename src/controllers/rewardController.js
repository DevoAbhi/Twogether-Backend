import { z } from 'zod';
import * as rewardService from '../services/rewardService.js';

const redeemSchema = z.object({
  profileId: z.string(),
  rewardId: z.string(),
  requestId: z.string().min(8),
});

const statusSchema = z.object({ status: z.enum(['Planned', 'Completed']) });

export async function listRewards(req, res) {
  res.json(await rewardService.listRewardsWithRedemptions());
}

export async function redeem(req, res) {
  const input = redeemSchema.parse(req.body);
  const result = await rewardService.redeemReward(input);
  res.status(result.duplicate ? 200 : 201).json(result);
}

export async function updateRedemption(req, res) {
  const { status } = statusSchema.parse(req.body);
  res.json(await rewardService.updateRedemptionStatus(req.params.id, status));
}
