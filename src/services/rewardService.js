import { Reward } from '../models/Reward.js';
import { Redemption } from '../models/Redemption.js';
import { Profile } from '../models/Profile.js';
import { HttpError } from '../utils/HttpError.js';
import { debitWallet, recordTransaction } from './walletService.js';

export async function listRewardsWithRedemptions() {
  const [rewards, redemptions] = await Promise.all([
    Reward.find({ isActive: true }).sort('xp'),
    Redemption.find().sort('-createdAt').limit(30).populate('reward').populate('by'),
  ]);
  return { rewards, redemptions };
}

export async function redeemReward({ profileId, rewardId, requestId }) {
  const existing = await Redemption.findOne({ requestId });
  if (existing) return { redemption: existing, duplicate: true };

  const [profile, reward] = await Promise.all([
    Profile.findById(profileId),
    Reward.findById(rewardId),
  ]);
  if (!profile || !reward || !reward.isActive) throw new HttpError(404, 'Reward not found');

  // The unique requestId is claimed first, so a double click cannot redeem twice.
  const redemption = await Redemption.create({
    reward: reward._id,
    by: profile._id,
    xp: reward.xp, // price comes from the database
    requestId,
  });

  const paid = await debitWallet(reward.xp);
  if (!paid) {
    await redemption.deleteOne();
    throw new HttpError(409, 'Not enough XP yet');
  }

  await recordTransaction({
    profile: profile._id,
    type: 'SPEND',
    amount: reward.xp,
    refType: 'redemption',
    refId: redemption._id,
    description: `${profile.name} redeemed ${reward.name} for ${reward.xp} XP`,
  });

  return { redemption };
}

export async function updateRedemptionStatus(id, status) {
  const redemption = await Redemption.findByIdAndUpdate(
    id,
    { status, completedAt: status === 'Completed' ? new Date() : null },
    { new: true }
  );
  if (!redemption) throw new HttpError(404, 'Redemption not found');
  return redemption;
}
