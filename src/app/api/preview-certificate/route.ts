import { type NextRequest, NextResponse } from "next/server"
import { generateCertificatePDF } from "@/lib/certificate-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submission_id, first_name, last_name, domain, start_date, end_date, tasks_performed, email } = body

    console.log("🔍 Certificate Preview: Starting generation...")
    console.log("📝 Input data:", { submission_id, first_name, last_name, domain, start_date, end_date })

    // Validate required fields
    if (!submission_id || !first_name || !last_name || !domain || !start_date || !end_date) {
      return NextResponse.json(
        {
          error: "Missing required fields: submission_id, first_name, last_name, domain, start_date, end_date",
        },
        { status: 400 },
      )
    }

    // Format dates
    const formattedStartDate = new Date(start_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    const formattedEndDate = new Date(end_date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    console.log("📅 Formatted dates:", { formattedStartDate, formattedEndDate })

    // Generate certificate PDF
    console.log("📜 Generating preview certificate...")
    const pdfBuffer = await generateCertificatePDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      submissionId: submission_id,
      email: email || "",
    })

    console.log("✅ Certificate preview generated successfully")
    console.log("📊 PDF buffer size:", pdfBuffer.length, "bytes")

    // Return the PDF directly for preview
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Preview_Certificate_${first_name}_${last_name}.pdf"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("❌ Certificate Preview: Error in generation:", error)
    return NextResponse.json(
      {
        error: "Certificate Preview: Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
