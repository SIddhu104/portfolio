import mongoose, { Schema, Document } from "mongoose";
import { IWebsiteSettings } from "@/types";

export interface IWebsiteSettingsDoc extends Omit<IWebsiteSettings, "_id">, Document {}

const WebsiteSettingsSchema = new Schema<IWebsiteSettingsDoc>(
  {
    siteTitle: { type: String, default: "Siddhesh Korade | Full-Stack & MERN Developer" },
    siteDescription: { type: String, default: "Portfolio of Siddhesh Korade" },
    contactEmail: { type: String, default: "siddheshkorade10@gmail.com" },
    accentColor: { type: String, default: "#8b5cf6" },
    enable3DEffects: { type: Boolean, default: true },
    enableCustomCursor: { type: Boolean, default: true },
    resumeFileName: { type: String, default: "Siddhesh_Korade_Resume.pdf" },
  },
  { timestamps: true }
);

export const WebsiteSettings =
  mongoose.models.WebsiteSettings ||
  mongoose.model<IWebsiteSettingsDoc>("WebsiteSettings", WebsiteSettingsSchema);
