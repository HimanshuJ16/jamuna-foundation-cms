import { sendCertificateConfirmationEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const candidateName = searchParams.get("candidateName");
    const certificateUrl = searchParams.get("certificateUrl");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const email = searchParams.get("email");
    const domain = searchParams.get("domain");

    // Basic input validation
    if (!id || !candidateName || !email) {
      console.error("Missing required query parameters: id, candidateName, email");
      return NextResponse.json(
        { error: "Missing required query parameters: id, candidateName, email" },
        { status: 400 }
      );
    }

    // Send the email
    await sendCertificateConfirmationEmail(
      id,
      candidateName,
      certificateUrl || "", // Fallback to empty string if null
      startDate || "",
      endDate || "",
      email,
      domain || ""
    );

    console.log("📧 Email sent successfully");
    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to send internship certificate email", error);
    return NextResponse.json(
      { error: "Failed to send internship certificate email" },
      { status: 500 }
    );
  }
}