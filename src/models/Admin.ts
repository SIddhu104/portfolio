import mongoose, { Schema, Document } from "mongoose";

export interface IAdminDoc extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "superadmin" | "admin";
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDoc>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "admin"], default: "superadmin" },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export const Admin = mongoose.models.Admin || mongoose.model<IAdminDoc>("Admin", AdminSchema);
