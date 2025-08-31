import { sendCertificateConfirmationEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract and log all incoming query parameters for debugging
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());
    console.log("Received query params:", params);

    // Collect and validate parameters
    const id = searchParams.get("id") || "";
    const candidateName = searchParams.get("candidateName") || "";
    const certificateUrl = searchParams.get("certificateUrl") || "";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const email = searchParams.get("email") || "";
    const domain = searchParams.get("domain") || "";

    // Field-by-field validation with specific errors
    const missing = [];
    if (!id) missing.push("id");
    if (!candidateName) missing.push("candidateName");
    if (!email) missing.push("email");
    if (missing.length > 0) {
      console.error("Missing required parameters:", missing.join(", "));
      return NextResponse.json(
        {
          error: `Missing required query parameters: ${missing.join(", ")}`,
          received: params,
        },
        { status: 400 }
      );
    }

    // Simple type checks if needed (for example, id as string, email as valid email, etc.)
    // Example: Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      console.error("Invalid email format:", email);
      return NextResponse.json(
        {
          error: "Invalid email format.",
          received: params,
        },
        { status: 400 }
      );
    }

    // Try sending the email and catch possible issues from external libs
    try {
      await sendCertificateConfirmationEmail(
        id,
        candidateName,
        certificateUrl,
        startDate,
        endDate,
        email,
        domain
      );
    } catch (sendError) {
      console.error("Email sending failed:", sendError);
      return NextResponse.json(
        {
          error: "Failed to send internship certificate email",
          details: sendError instanceof Error ? sendError.message : sendError,
        },
        { status: 502 }
      );
    }

    console.log("📧 Email sent successfully for:", email);
    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    // Final fallback for unanticipated server errors
    console.error("Fatal server error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}