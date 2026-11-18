import mongoose, { Schema, Document } from "mongoose";
import { IProject } from "@/types";

export interface IProjectDoc extends Omit<IProject, "_id">, Document {}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      enum: ["MERN Stack", "Next.js", "React.js", "Full Stack", "AI / Gen-AI", "Other"],
      default: "MERN Stack",
    },
    technologies: { type: [String], default: [] },
    features: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ isPublished: 1, order: 1 });

export const Project = mongoose.models.Project || mongoose.model<IProjectDoc>("Project", ProjectSchema);
