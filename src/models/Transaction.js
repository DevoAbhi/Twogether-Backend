import { Schema, model } from 'mongoose';

// Audit trail of every XP movement (EARN or SPEND).
const schema = new Schema(
  {
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    type: { type: String, enum: ['EARN', 'SPEND'], required: true },
    amount: { type: Number, min: 0, required: true },
    refType: String,
    refId: Schema.Types.ObjectId,
    description: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Transaction = model('Transaction', schema);
