import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import {
  getProjectsData,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const project = await getProjectById(id);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, project });
    }

    const admin = getAdminFromRequest(req);
    const includeDrafts = admin !== null && searchParams.get("all") === "true";

    const projects = await getProjectsData(!includeDrafts);
    return NextResponse.json({ success: true, projects });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const newProject = await createProject(body);
    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const updated = await updateProject(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (err) {
    console.error("PUT /api/projects error:", err);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
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
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const success = await deleteProject(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/projects error:", err);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
