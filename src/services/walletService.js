import { Wallet } from '../models/Wallet.js';
import { Transaction } from '../models/Transaction.js';

const WALLET_ID = 'shared';

export function getWallet() {
  return Wallet.findById(WALLET_ID).lean();
}

export function getTransactions(limit = 50) {
  return Transaction.find().sort('-createdAt').limit(limit);
}

export async function creditWallet(profileId, xp) {
  await Wallet.updateOne(
    { _id: WALLET_ID },
    { $inc: { available: xp, lifetime: xp, [`earned.${profileId}`]: xp } }
  );
}

// Only deducts if enough XP is available. The check and the update happen in
// one atomic operation, so the balance can never go negative.
export async function debitWallet(xp) {
  const updated = await Wallet.findOneAndUpdate(
    { _id: WALLET_ID, available: { $gte: xp } },
    { $inc: { available: -xp, spent: xp } }
  );
  return Boolean(updated);
}

export function recordTransaction(data) {
  return Transaction.create(data);
}

export function ensureWallet() {
  return Wallet.updateOne(
    { _id: WALLET_ID },
    { $setOnInsert: { available: 0, lifetime: 0, spent: 0, earned: {} } },
    { upsert: true }
  );
}
