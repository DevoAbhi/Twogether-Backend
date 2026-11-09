import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    activity: { type: Schema.Types.ObjectId, ref: 'Activity', required: true },
    minutes: { type: Number, default: 0 },
    xp: { type: Number, required: true },
    notes: String,
    photoId: String,
    // Unique key sent by the client so a repeated request can never be counted twice.
    requestId: { type: String, unique: true, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Session = model('Session', schema);
