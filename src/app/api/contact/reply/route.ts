import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendReplyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const admin = getAdminFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const body = await req.json();
  const { recipientEmail, recipientName, originalSubject, replyBody, isInitialEmail } = body;

  if (!recipientEmail || !originalSubject || !replyBody?.trim()) {
    return NextResponse.json({ error: "Recipient, subject, and reply are required" }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(recipientEmail)) {
    return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
  }

  const result = await sendReplyEmail({
    recipientName: recipientName || "there",
    recipientEmail,
    originalSubject,
    replyBody: replyBody.trim(),
    isInitialEmail: isInitialEmail === true,
  });

  if (!result.sent) {
    return NextResponse.json(
      { error: result.error || "Email could not be sent" },
      { status: 503 }
    );
  }

  return NextResponse.json({ success: true, method: result.method });
}
