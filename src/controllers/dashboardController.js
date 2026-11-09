import { getDashboard } from '../services/dashboardService.js';

export async function dashboard(req, res) {
  res.json(await getDashboard());
}
