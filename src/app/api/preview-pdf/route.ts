import { type NextRequest, NextResponse } from "next/server"
import { generateOfferLetterPDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, first_name, last_name, domain, date_time } = body

    console.log("🔍 Preview: Starting offer letter generation...")
    console.log("📝 Input data:", { id, first_name, last_name, domain, date_time })

    // Validate required fields
    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json({ error: "Missing required fields: id, first_name, last_name, domain" }, { status: 400 })
    }

    // Calculate internship dates (4 weeks duration as per template)
    const submissionDate = new Date(date_time)
    const startDate = new Date(submissionDate)

    const day = submissionDate.getDate()
    const month = submissionDate.getMonth()
    const year = submissionDate.getFullYear()

    if (day >= 1 && day <= 12) {
      // Start on 15th of the same month
      startDate.setFullYear(year)
      startDate.setMonth(month)
      startDate.setDate(15)
    } else {
      // Start on 1st of next month
      startDate.setFullYear(year)
      startDate.setMonth(month + 1)
      startDate.setDate(1)
    }

    let endDate: Date

    if (startDate.getDate() === 15) {
      // +30 days
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)
    } else {
      // End on last day of that month
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0) // Day 0 = last day of current month
    }

    const formattedStartDate = startDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    const formattedEndDate = endDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    console.log("📅 Calculated dates:", { formattedStartDate, formattedEndDate })

    // Generate PDF
    console.log("📄 Generating preview PDF...")
    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      submissionId: id,
    })

    console.log("✅ Preview PDF generated successfully")
    console.log("📊 PDF buffer size:", pdfBuffer.length, "bytes")

    // Return the PDF directly for preview
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="Preview_Offer_Letter_${first_name}_${last_name}.pdf"`,
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("❌ Preview: Error in offer letter generation:", error)
    return NextResponse.json(
      {
        error: "Preview: Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
