import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { markMessageRead, deleteContactMessage } from "@/lib/data-service";

export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await props.params;
    const body = await req.json();
    const isRead = typeof body.isRead === "boolean" ? body.isRead : true;

    const success = await markMessageRead(id, isRead);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("PATCH /api/contact/[id] error:", err);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await props.params;
    const success = await deleteContactMessage(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/contact/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
