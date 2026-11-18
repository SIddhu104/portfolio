import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateTimeline, deleteTimeline } from "@/lib/data-service";

export async function PUT(
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
    const updated = await updateTimeline(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Timeline entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, timeline: updated });
  } catch (err) {
    console.error("PUT /api/timeline/[id] error:", err);
    return NextResponse.json({ error: "Failed to update timeline entry" }, { status: 500 });
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
    const success = await deleteTimeline(id);

    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/timeline/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete timeline entry" }, { status: 500 });
  }
}
