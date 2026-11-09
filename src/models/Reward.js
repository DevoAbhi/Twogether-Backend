import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    key: String,
    name: { type: String, required: true },
    description: String,
    xp: { type: Number, required: true },
    emoji: String,
    category: String, // 'date' or 'trip'
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Reward = model('Reward', schema);
