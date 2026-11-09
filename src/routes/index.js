import { Router } from 'express';
import { asyncHandler as wrap } from '../utils/asyncHandler.js';
import { uploadPhoto } from '../middleware/upload.js';
import * as profiles from '../controllers/profileController.js';
import * as activities from '../controllers/activityController.js';
import * as wallet from '../controllers/walletController.js';
import * as rewards from '../controllers/rewardController.js';
import * as achievements from '../controllers/achievementController.js';
import * as dashboard from '../controllers/dashboardController.js';
import * as photos from '../controllers/photoController.js';

const router = Router();

router.get('/check', (req, res) => res.json({ ok: true }));

router.get('/profiles', wrap(profiles.getProfiles));

router.get('/activities', wrap(activities.listActivities));
router.post('/activities/submit', uploadPhoto, wrap(activities.submitActivity));
router.get('/history', wrap(activities.activityHistory));
router.get('/activities/history', wrap(activities.activityHistory));

router.get('/wallet', wrap(wallet.getWallet));
router.get('/wallet/transactions', wrap(wallet.getTransactions));

router.get('/rewards', wrap(rewards.listRewards));
router.post('/rewards/redeem', wrap(rewards.redeem));
router.patch('/rewards/redemptions/:id', wrap(rewards.updateRedemption));

router.get('/achievements', wrap(achievements.listAchievements));
router.get('/achievements/progress', wrap(achievements.listAchievements));

router.get('/dashboard', wrap(dashboard.dashboard));
router.get('/photos/:id', wrap(photos.getPhoto));

export default router;
