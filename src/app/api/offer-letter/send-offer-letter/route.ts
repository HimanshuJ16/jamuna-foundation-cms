import { sendInternshipConfirmationEmail } from "@/lib/email";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const candidateName = searchParams.get("candidateName");
    const downloadUrl = searchParams.get("downloadUrl");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const taskLink = searchParams.get("taskLink");
    const email = searchParams.get("email");
    const domain = searchParams.get("domain");

    // Basic input validation
    if (!id || !candidateName || !email) {
      return NextResponse.json(
        { error: "Missing required query parameters: id, candidateName, email" },
        { status: 400 }
      );
    }

    // Send the email
    await sendInternshipConfirmationEmail(
      id,
      candidateName,
      downloadUrl || "", // Fallback to empty string if null
      startDate || "",
      endDate || "",
      taskLink || "",
      email,
      domain || ""
    );

    return NextResponse.json({ sent: true }, { status: 200 });
  } catch (error) {
    console.error("⚠️ Error in POST /internship:", error);
    return NextResponse.json(
      { error: "Failed to send internship confirmation email" },
      { status: 500 }
    );
  }
}