import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import {
  getTimelineData,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from "@/lib/data-service";

export async function GET() {
  try {
    const timeline = await getTimelineData();
    return NextResponse.json({ success: true, timeline });
  } catch (err) {
    console.error("GET /api/timeline error:", err);
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.organization || !body.type) {
      return NextResponse.json(
        { error: "Type, title and organization are required" },
        { status: 400 }
      );
    }

    const newEntry = await createTimeline(body);
    return NextResponse.json({ success: true, timeline: newEntry }, { status: 201 });
  } catch (err) {
    console.error("POST /api/timeline error:", err);
    return NextResponse.json({ error: "Failed to create timeline entry" }, { status: 500 });
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
      return NextResponse.json({ error: "Timeline entry ID is required" }, { status: 400 });
    }

    const updated = await updateTimeline(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Timeline entry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, timeline: updated });
  } catch (err) {
    console.error("PUT /api/timeline error:", err);
    return NextResponse.json({ error: "Failed to update timeline entry" }, { status: 500 });
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
      return NextResponse.json({ error: "Timeline entry ID is required" }, { status: 400 });
    }

    const success = await deleteTimeline(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/timeline error:", err);
    return NextResponse.json({ error: "Failed to delete timeline entry" }, { status: 500 });
  }
}
