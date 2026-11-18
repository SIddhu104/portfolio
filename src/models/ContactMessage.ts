import mongoose, { Schema, Document } from "mongoose";
import { IContactMessage } from "@/types";

export interface IContactMessageDoc extends Omit<IContactMessage, "_id">, Document {}

const ContactMessageSchema = new Schema<IContactMessageDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactMessageSchema.index({ createdAt: -1 });

export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessageDoc>("ContactMessage", ContactMessageSchema);
