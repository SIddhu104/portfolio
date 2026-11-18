import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { getSkillsData, createSkill, updateSkill, deleteSkill } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    const searchParams = req.nextUrl.searchParams;
    const includeDisabled = admin !== null && searchParams.get("all") === "true";

    const skills = await getSkillsData(!includeDisabled);
    return NextResponse.json({ success: true, skills });
  } catch (err) {
    console.error("GET /api/skills error:", err);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const newSkill = await createSkill(body);
    return NextResponse.json({ success: true, skill: newSkill }, { status: 201 });
  } catch (err) {
    console.error("POST /api/skills error:", err);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const id = body._id || body.id || searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const updated = await updateSkill(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, skill: updated });
  } catch (err) {
    console.error("PUT /api/skills error:", err);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    let id = searchParams.get("id");
    if (!id) {
      try {
        const body = await req.json();
        id = body._id || body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Skill ID is required" }, { status: 400 });
    }

    const success = await deleteSkill(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/skills error:", err);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
