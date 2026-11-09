import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    data: { type: Buffer, required: true },
    mime: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Photo = model('Photo', schema);
