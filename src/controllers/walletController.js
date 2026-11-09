import * as walletService from '../services/walletService.js';

export async function getWallet(req, res) {
  res.json(await walletService.getWallet());
}

export async function getTransactions(req, res) {
  res.json(await walletService.getTransactions());
}
