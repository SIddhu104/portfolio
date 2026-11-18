import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { updateSkill, deleteSkill } from "@/lib/data-service";

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
    const updated = await updateSkill(id, body);

    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, skill: updated });
  } catch (err) {
    console.error("PUT /api/skills/[id] error:", err);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
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
    const success = await deleteSkill(id);

    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/skills/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
