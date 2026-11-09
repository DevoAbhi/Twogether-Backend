import { Activity } from '../models/Activity.js';
import { Profile } from '../models/Profile.js';
import { Session } from '../models/Session.js';
import { Photo } from '../models/Photo.js';
import { HttpError } from '../utils/HttpError.js';
import { creditWallet, recordTransaction } from './walletService.js';

export function listActivities() {
  return Activity.find({ isActive: true }).sort('createdAt');
}

// XP = floor(minutes / 30) * rate for duration based activities, flat otherwise.
export function calculateXp(activity, minutes) {
  if (!activity.per30) return activity.xp;
  return Math.floor(minutes / 30) * activity.xp;
}

async function minutesLoggedToday(profileId, activityId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const result = await Session.aggregate([
    { $match: { profile: profileId, activity: activityId, createdAt: { $gte: startOfDay } } },
    { $group: { _id: null, total: { $sum: '$minutes' } } },
  ]);
  return result[0]?.total || 0;
}

async function savePhoto(file) {
  if (!file) return undefined;
  if (!file.mimetype.startsWith('image/')) throw new HttpError(400, 'Only images are allowed');
  const photo = await Photo.create({ data: file.buffer, mime: file.mimetype });
  return String(photo._id);
}

export async function submitActivity({ profileId, activityId, requestId, minutes, notes }, file) {
  // Same requestId = same submission, so just return the original result.
  const existing = await Session.findOne({ requestId });
  if (existing) return { session: existing, xp: existing.xp, duplicate: true };

  const [profile, activity] = await Promise.all([
    Profile.findById(profileId),
    Activity.findById(activityId),
  ]);
  if (!profile || !activity || !activity.isActive) {
    throw new HttpError(404, 'Profile or activity not found');
  }

  // XP is always calculated here from database values, never trusted from the client.
  const loggedMinutes = activity.per30 ? minutes : 0;
  const xp = calculateXp(activity, loggedMinutes);
  if (xp < 1) throw new HttpError(422, 'Log at least 30 minutes');

  if (activity.per30) {
    const already = await minutesLoggedToday(profile._id, activity._id);
    if (already + loggedMinutes > activity.dailyCapMin) {
      throw new HttpError(422, 'Daily limit reached for this activity');
    }
  }

  const photoId = await savePhoto(file);
  const session = await Session.create({
    profile: profile._id,
    activity: activity._id,
    minutes: loggedMinutes,
    xp,
    notes,
    photoId,
    requestId,
  });

  await creditWallet(profile.id, xp);
  await recordTransaction({
    profile: profile._id,
    type: 'EARN',
    amount: xp,
    refType: 'session',
    refId: session._id,
    description: `${profile.name} earned ${xp} XP: ${activity.name}${loggedMinutes ? ` (${loggedMinutes} min)` : ''}`,
  });

  return { session, xp };
}
