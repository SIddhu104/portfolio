import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";

export async function GET(req: NextRequest) {
  const adminPayload = getAdminFromRequest(req);
  if (!adminPayload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const db = await connectDB();
  if (db && !adminPayload.adminId.startsWith("dev_")) {
    const admin = await Admin.findById(adminPayload.adminId).select("-passwordHash").lean();
    if (admin) {
      return NextResponse.json({ authenticated: true, admin });
    }
  }

  return NextResponse.json({
    authenticated: true,
    admin: {
      id: adminPayload.adminId,
      email: adminPayload.email,
      fullName: "Siddhesh Korade",
      role: adminPayload.role,
    },
  });
}
