import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    name: { type: String, required: true },
    emoji: String,
    note: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Profile = model('Profile', schema);
