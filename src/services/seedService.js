import { Profile } from '../models/Profile.js';
import { Activity } from '../models/Activity.js';
import { Reward } from '../models/Reward.js';
import { ensureWallet } from './walletService.js';

const profiles = [
  { name: 'Abhinab', emoji: '🌙', note: 'Chief snack officer' },
  { name: 'Indrani', emoji: '🌸', note: 'Keeper of the playlists' },
];

// per30: true means "xp per 30 minutes", false means a flat amount.
const activities = [
  { key: 'gym', name: 'Gym / Workout', category: 'Fitness', xp: 10, per30: true, description: 'Lift, sweat, repeat.' },
  { key: 'run', name: 'Running / Cardio', category: 'Fitness', xp: 10, per30: true, description: 'Run, cycle, swim.' },
  { key: 'fitgoal', name: 'Personal fitness goal', category: 'Fitness', xp: 20, per30: false, description: 'Hit a personal best.' },
  { key: 'study', name: 'Studying', category: 'Learning', xp: 10, per30: true, description: 'Deep focus time.' },
  { key: 'skill', name: 'Learning a new skill', category: 'Learning', xp: 25, per30: false, description: 'Try something new.' },
  { key: 'cook', name: 'Cooking a meal', category: 'Lifestyle', xp: 15, per30: false, description: 'Made with love.' },
  { key: 'clean', name: 'Cleaning room', category: 'Lifestyle', xp: 10, per30: false, description: 'A tidy nest.' },
  { key: 'chores', name: 'Household chores', category: 'Lifestyle', xp: 10, per30: false, description: 'Little things add up.' },
  { key: 'detox', name: 'Digital detox', category: 'Lifestyle', xp: 10, per30: false, description: 'Phone down, world up.' },
];

const rewards = [
  { key: 'ice', name: 'Ice Cream Date', xp: 50, emoji: '🍦', category: 'date', description: 'Two scoops, one spoon.' },
  { key: 'cafe', name: 'Cafe / Street Food Date', xp: 100, emoji: '☕', category: 'date', description: 'Chai, chaat and chatter.' },
  { key: 'movie', name: 'Movie Date', xp: 120, emoji: '🎬', category: 'date', description: 'Popcorn and cuddles.' },
  { key: 'activity', name: 'Activity Date', xp: 150, emoji: '🎳', category: 'date', description: 'Bowling, pottery, anything fun.' },
  { key: 'fine', name: 'Fine Dining', xp: 300, emoji: '🍷', category: 'date', description: 'Dress up, dine slow.' },
  { key: 'day', name: 'One-Day Trip', xp: 600, emoji: '🚗', category: 'trip', description: 'Pack a bag, pick a road.' },
  { key: 'weekend', name: 'Weekend Getaway', xp: 2000, emoji: '🏝️', category: 'trip', description: 'Two days, zero alarms.' },
];

// Safe to run on every start: only inserts what is missing, never overwrites edits.
export async function seedDatabase() {
  await ensureWallet();

  if ((await Profile.countDocuments()) === 0) {
    await Profile.insertMany(profiles);
  }
  for (const item of activities) {
    await Activity.updateOne({ key: item.key }, { $setOnInsert: item }, { upsert: true });
  }
  for (const item of rewards) {
    await Reward.updateOne({ key: item.key }, { $setOnInsert: item }, { upsert: true });
  }
}
