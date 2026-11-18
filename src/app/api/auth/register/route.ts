import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { hashPassword, signAdminToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password, confirmPassword, adminSecret } = body;

    if (!fullName || !email || !password || !confirmPassword || !adminSecret) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const expectedSecret = process.env.ADMIN_SETUP_SECRET || "admin_secret_setup_key_2026";
    if (adminSecret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid Admin Setup Secret Key" }, { status: 403 });
    }

    const db = await connectDB();
    if (db) {
      const existingAdminCount = await Admin.countDocuments();
      if (existingAdminCount > 0) {
        return NextResponse.json(
          { error: "Admin registration is permanently closed. An administrator already exists." },
          { status: 403 }
        );
      }

      const existingByEmail = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (existingByEmail) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);
      const newAdmin = await Admin.create({
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "superadmin",
        lastLogin: new Date(),
      });

      const token = signAdminToken({
        adminId: newAdmin._id.toString(),
        email: newAdmin.email,
        role: newAdmin.role,
      });

      const response = NextResponse.json({
        success: true,
        message: "Admin registered successfully",
        admin: {
          id: newAdmin._id,
          fullName: newAdmin.fullName,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    // Fallback if DB is offline/unconfigured during setup
    const token = signAdminToken({
      adminId: "dev_admin_1",
      email: email.toLowerCase().trim(),
      role: "superadmin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin session initialized (Development mode)",
      admin: {
        id: "dev_admin_1",
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        role: "superadmin",
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
