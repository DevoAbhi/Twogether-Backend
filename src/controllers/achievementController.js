import { getAchievements } from '../services/achievementService.js';

export async function listAchievements(req, res) {
  res.json(await getAchievements());
}
