import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import {
  createContactMessage,
  getMessagesData,
  markMessageRead,
  deleteContactMessage,
} from "@/lib/data-service";
import { sendContactEmail } from "@/lib/email";

// Simple in-memory rate limiter for contact form spam protection
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + 60 * 1000 }); // 1 minute window
    return false;
  }
  if (entry.count >= 5) {
    return true; // Max 5 messages per minute
  }
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local_client";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    // Server-side validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid name (at least 2 characters)." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json(
        { error: "Please enter a subject (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Save in database / data service
    const saved = await createContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Dispatch real email to Siddhesh's inbox (Gmail SMTP or Resend)
    const emailResult = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you! Your message has been received. I will get back to you shortly.",
      contactId: saved._id,
      emailSent: emailResult.sent,
    });
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const messages = await getMessagesData();
    return NextResponse.json({ success: true, messages });
  } catch (err) {
    console.error("GET /api/contact error:", err);
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const searchParams = req.nextUrl.searchParams;
    const id = body._id || body.id || searchParams.get("id");
    const isRead = typeof body.isRead === "boolean" ? body.isRead : true;

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const success = await markMessageRead(id, isRead);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("PATCH /api/contact error:", err);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
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
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    const success = await deleteContactMessage(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("DELETE /api/contact error:", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
