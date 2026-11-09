import { Profile } from '../models/Profile.js';
import { Reward } from '../models/Reward.js';
import { getWallet, getTransactions } from './walletService.js';

const LEVELS = [
  { from: 0, name: 'Just Started' },
  { from: 200, name: 'Growing Together' },
  { from: 600, name: 'Little Adventurers' },
  { from: 1500, name: 'Dream Team' },
  { from: 3000, name: 'Forever Exploring' },
];

export function calculateLevel(lifetimeXp) {
  let index = 0;
  LEVELS.forEach((level, i) => {
    if (lifetimeXp >= level.from) index = i;
  });

  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const progress = next ? (lifetimeXp - current.from) / (next.from - current.from) : 1;

  return { n: index + 1, name: current.name, progress };
}

export async function getDashboard() {
  const [wallet, profiles, rewards, recent] = await Promise.all([
    getWallet(),
    Profile.find().sort('createdAt').lean(),
    Reward.find({ isActive: true }).sort('xp').lean(),
    getTransactions(8),
  ]);

  const nextReward = rewards.find((r) => r.xp > wallet.available);

  return {
    wallet,
    profiles,
    level: calculateLevel(wallet.lifetime),
    next: nextReward ? { reward: nextReward, need: nextReward.xp - wallet.available } : null,
    recent,
  };
}
