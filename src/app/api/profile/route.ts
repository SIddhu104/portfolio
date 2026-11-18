import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getProfileData, updateProfileData } from "@/lib/data-service";

export async function GET() {
  try {
    const profile = await getProfileData();
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateProfileData(body);
    return NextResponse.json({ success: true, profile: updated });
  } catch (err) {
    console.error("PUT /api/profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
