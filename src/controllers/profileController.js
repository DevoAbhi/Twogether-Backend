import { Profile } from '../models/Profile.js';

export async function getProfiles(req, res) {
  res.json(await Profile.find().sort('createdAt'));
}
