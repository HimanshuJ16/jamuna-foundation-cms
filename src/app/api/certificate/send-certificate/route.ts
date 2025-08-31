import { sendCertificateConfirmationEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let parsedData: any = {}

    // Parse the request body
    const contentType = request.headers.get("content-type") || ""
    console.log("📥 Content-Type:", contentType)

    if (contentType.includes("application/json")) {
      console.log("📝 Parsing as JSON...")
      const rawBody = await request.json()
      console.log("🔍 Raw JSON body received:", JSON.stringify(rawBody, null, 2))

      // Extract data from nested structure
      parsedData = rawBody.data || rawBody
    } else {
      // Try form data
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        parsedData[key] = value
      }
    }

    console.log("📋 Parsed certificate data:", parsedData)

    // Extract required fields
    const {
      id,
      candidateName,
      certificateUrl,
      startDate,
      endDate,
      email,
      domain
    } = parsedData

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