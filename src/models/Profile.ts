import mongoose, { Schema, Document } from "mongoose";
import { IProfile } from "@/types";

export interface IProfileDoc extends Omit<IProfile, "_id">, Document {}

const ProfileSchema = new Schema<IProfileDoc>(
  {
    name: { type: String, required: true, default: "Siddhesh Korade" },
    titles: { type: [String], default: ["MERN Stack Developer", "Full-Stack Web Developer", "React.js Developer", "Next.js (Learning Phase)"] },
    heroBio: { type: String, default: "" },
    aboutBio: { type: String, default: "" },
    location: { type: String, default: "Kolhapur, Maharashtra, India" },
    email: { type: String, default: "siddheshkorade10@gmail.com" },
    phone: { type: String, default: "+91 8261825954" },
    githubUrl: { type: String, default: "https://github.com/siddheshkorade" },
    linkedinUrl: { type: String, default: "https://linkedin.com/in/siddheshkorade" },
    resumeUrl: { type: String, default: "/resume.pdf" },
    avatarUrl: { type: String, default: "" },
    isOpenToWork: { type: Boolean, default: true },
    yearsOfExperience: { type: String, default: "Fresher" },
    projectsCompleted: { type: String, default: "MERN Stack" },
  },
  { timestamps: true }
);

export const Profile = mongoose.models.Profile || mongoose.model<IProfileDoc>("Profile", ProfileSchema);
