import mongoose, { Schema, Document } from "mongoose";
import { ISkill } from "@/types";

export interface ISkillDoc extends Omit<ISkill, "_id">, Document {}

const SkillSchema = new Schema<ISkillDoc>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Frontend", "Backend", "Database", "Tools & Security"],
      required: true,
    },
    proficiency: { type: Number, min: 0, max: 100, default: 80 },
    iconName: { type: String },
    order: { type: Number, default: 0 },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.models.Skill || mongoose.model<ISkillDoc>("Skill", SkillSchema);
