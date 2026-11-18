import mongoose, { Schema, Document } from "mongoose";
import { ITimeline } from "@/types";

export interface ITimelineDoc extends Omit<ITimeline, "_id">, Document {}

const TimelineSchema = new Schema<ITimelineDoc>(
  {
    type: {
      type: String,
      enum: ["Internship", "Work", "Education", "Certification", "Achievement"],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    period: { type: String, required: true, trim: true },
    duration: { type: String, trim: true },
    grade: { type: String, trim: true },
    description: { type: String, required: true },
    highlights: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TimelineSchema.index({ type: 1, order: 1 });

export const Timeline = mongoose.models.Timeline || mongoose.model<ITimelineDoc>("Timeline", TimelineSchema);
