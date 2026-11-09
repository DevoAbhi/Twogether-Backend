import { Schema, model } from 'mongoose';

// One shared document (_id: 'shared'). Counters are changed with atomic $inc updates.
const schema = new Schema(
  {
    _id: String,
    available: { type: Number, default: 0 },
    lifetime: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    earned: { type: Schema.Types.Mixed, default: {} }, // { [profileId]: lifetimeXp }
  },
  { minimize: false }
);

export const Wallet = model('Wallet', schema);
