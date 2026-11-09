import { Session } from '../models/Session.js';
import { Activity } from '../models/Activity.js';
import { Redemption } from '../models/Redemption.js';
import { Reward } from '../models/Reward.js';
import { Profile } from '../models/Profile.js';
import { getWallet } from './walletService.js';

const ONE_DAY = 24 * 60 * 60 * 1000;

function longestStreak(sessions) {
  const days = [...new Set(sessions.map((s) => s.createdAt.toISOString().slice(0, 10)))].sort();
  let best = 0;
  let current = 0;
  let previous = 0;

  for (const day of days) {
    const time = Date.parse(day);
    current = previous && time - previous === ONE_DAY ? current + 1 : 1;
    previous = time;
    best = Math.max(best, current);
  }
  return best;
}

// Achievements use lifetime data only, never the spendable balance.
export async function getAchievements() {
  const [wallet, sessions, activities, redemptions, rewards, profiles] = await Promise.all([
    getWallet(),
    Session.find().lean(),
    Activity.find().lean(),
    Redemption.find().lean(),
    Reward.find().lean(),
    Profile.find().lean(),
  ]);

  const keyOf = (activityId) => activities.find((a) => String(a._id) === String(activityId))?.key;
  const countActivity = (key, profileId) =>
    sessions.filter(
      (s) => keyOf(s.activity) === key && (!profileId || String(s.profile) === profileId)
    ).length;

  const tripsRedeemed = redemptions.filter(
    (r) => rewards.find((x) => String(x._id) === String(r.reward))?.category === 'trip'
  ).length;

  const bothWorkouts = Math.min(...profiles.map((p) => countActivity('gym', String(p._id))), 10);

  const build = (id, name, icon, description, value, goal) => ({
    id, name, icon, description,
    value: Math.min(value, goal),
    goal,
    unlocked: value >= goal,
  });

  return [
    build('first', 'First Steps', '👣', 'Earn your first XP', wallet.lifetime > 0 ? 1 : 0, 1),
    build('streak', '7-Day Streak', '🔥', 'Be active 7 days in a row', longestStreak(sessions), 7),
    build('duo', 'Fitness Duo', '💪', 'Both of you complete 10 workouts', bothWorkouts, 10),
    build('chef', 'MasterChef', '🍳', 'Complete 10 cooking activities', countActivity('cook'), 10),
    build('adventure', 'Adventure Awaits', '🧭', 'Redeem your first trip', tripsRedeemed, 1),
    build('power', 'Power Couple', '💞', 'Earn 1,000 lifetime XP together', wallet.lifetime, 1000),
    build('wanderlust', 'Wanderlust', '🌍', 'Redeem 3 trips', tripsRedeemed, 3),
  ];
}
