import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getSettingsData, updateSettingsData } from "@/lib/data-service";

export async function GET() {
  try {
    const settings = await getSettingsData();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await updateSettingsData(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
