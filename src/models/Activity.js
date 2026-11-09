import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    xp: { type: Number, required: true },        // XP per 30 min, or a flat amount
    per30: { type: Boolean, default: false },    // true = duration based
    dailyCapMin: { type: Number, default: 480 }, // max minutes per person per day
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Activity = model('Activity', schema);
