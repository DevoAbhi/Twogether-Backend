import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    reward: { type: Schema.Types.ObjectId, ref: 'Reward', required: true },
    by: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    xp: { type: Number, required: true },
    status: { type: String, enum: ['Planned', 'Completed'], default: 'Planned' },
    completedAt: Date,
    requestId: { type: String, unique: true, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Redemption = model('Redemption', schema);
