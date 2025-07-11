import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/pdf-generator"
import { uploadToCloudinary } from "@/lib/cloudinary-storage"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Parse query parameters instead of request body
    const params = request.nextUrl.searchParams

    const id = params.get("id") ?? undefined
    const first_name = params.get("first_name") ?? undefined
    const last_name = params.get("last_name") ?? undefined
    const domain = params.get("domain") ?? undefined
    const date_time = params.get("date_time") ?? undefined

    console.log("📩 Received via query:", { id, first_name, last_name, domain, date_time })

    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json(
        { error: "Missing required fields: id, first_name, last_name, domain" },
        { status: 400 }
      )
    }

    const existing = await prisma.offerLetter.findUnique({ where: { submissionId: id } })

    if (existing) {
      const baseUrl = request.nextUrl.origin
      return NextResponse.json({
        success: true,
        submissionId: id,
        candidateName: `${existing.firstName} ${existing.lastName}`,
        domain: existing.domain,
        offerLetterUrl: `${baseUrl}/api/download-pdf/${id}`,
        viewUrl: `${baseUrl}/api/view-pdf/${id}`,
        message: "Offer letter already exists",
      })
    }

    const submissionDate = date_time ? new Date(date_time) : new Date()
    const startDate = new Date(submissionDate)
    startDate.setDate(startDate.getDate() + 7)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 28)

    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: startDate.toLocaleDateString("en-GB"),
      endDate: endDate.toLocaleDateString("en-GB"),
      submissionId: id,
    })

    const fileName = `Internship_Offer_Letter_${first_name}_${last_name}_${id}.pdf`
    const cloudinaryUrl = await uploadToCloudinary(pdfBuffer, fileName)

    await prisma.offerLetter.create({
      data: {
        submissionId: id,
        firstName: first_name,
        lastName: last_name,
        domain,
        startDate,
        endDate,
        cloudinaryUrl,
        submissionDateTime: submissionDate,
      },
    })

    const baseUrl = request.nextUrl.origin

    return NextResponse.json({
      success: true,
      submissionId: id,
      candidateName: `${first_name} ${last_name}`,
      domain,
      offerLetterUrl: `${baseUrl}/api/download-pdf/${id}`,
      viewUrl: `${baseUrl}/api/view-pdf/${id}`,
      debug: {
        pdfSize: pdfBuffer.length,
        fileName,
        cloudinaryUrl,
      },
    })
  } catch (error) {
    console.error("❌ Error generating offer letter:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
