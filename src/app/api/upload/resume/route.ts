import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateProfileData } from "@/lib/data-service";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate admin user
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 2. Parse uploaded form data
    const formData = await req.formData();
    const file = (formData.get("resume") || formData.get("file")) as File | null;

    if (!file) {
      return NextResponse.json({ error: "No resume file provided" }, { status: 400 });
    }

    // 3. Validate file type (must be PDF)
    const isPdfName = file.name.toLowerCase().endsWith(".pdf");
    const isPdfType = file.type === "application/pdf" || file.type === "";
    if (!isPdfName && !isPdfType) {
      return NextResponse.json({ error: "Invalid file type. Only PDF files (.pdf) are allowed." }, { status: 400 });
    }

    // 4. Maximum size check (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
    }

    // 5. Convert file to buffer and write to public/resume.pdf
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), "public");
    const resumePath = path.join(publicDir, "resume.pdf");

    // Ensure public folder exists
    await fs.mkdir(publicDir, { recursive: true });
    await fs.writeFile(resumePath, buffer);

    // 6. Update profile resume URL with timestamp cache buster
    const resumeUrl = `/resume.pdf?v=${Date.now()}`;
    await updateProfileData({ resumeUrl });

    return NextResponse.json({
      success: true,
      message: "New resume uploaded and published successfully! Live download links now serve this file.",
      url: resumeUrl,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err: unknown) {
    console.error("POST /api/upload/resume error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to upload resume file" },
      { status: 500 }
    );
  }
}
