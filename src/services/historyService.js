import { Session } from '../models/Session.js';
import { Redemption } from '../models/Redemption.js';
import { Activity } from '../models/Activity.js';
import { Profile } from '../models/Profile.js';
import { Reward } from '../models/Reward.js';

export async function getHistory({ filter = 'all', profileId }) {
  const showActivities = filter !== 'redemptions';
  const showRedemptions = filter !== 'activities';

  const [sessions, redemptions, activities, profiles, rewards] = await Promise.all([
    showActivities ? Session.find(profileId ? { profile: profileId } : {}).sort('-createdAt').limit(100).lean() : [],
    showRedemptions ? Redemption.find(profileId ? { by: profileId } : {}).sort('-createdAt').limit(100).lean() : [],
    Activity.find().lean(),
    Profile.find().lean(),
    Reward.find().lean(),
  ]);

  const find = (list, id) => list.find((item) => String(item._id) === String(id));

  const earned = sessions.map((s) => {
    const activity = find(activities, s.activity);
    return {
      kind: 'earn',
      id: s._id,
      who: find(profiles, s.profile)?.name,
      title: `${activity?.name}${s.minutes ? ` · ${s.minutes} min` : ''}`,
      xp: s.xp,
      notes: s.notes,
      photoId: s.photoId,
      at: s.createdAt,
    };
  });

  const spent = redemptions.map((r) => {
    const reward = find(rewards, r.reward);
    return {
      kind: 'spend',
      id: r._id,
      who: find(profiles, r.by)?.name,
      title: reward?.name,
      emoji: reward?.emoji,
      xp: r.xp,
      at: r.createdAt,
    };
  });

  return [...earned, ...spent].sort((a, b) => new Date(b.at) - new Date(a.at));
}
