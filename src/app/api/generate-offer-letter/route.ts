import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/pdf-generator"
import { uploadToCloudinary } from "@/lib/cloudinary-storage"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, first_name, last_name, domain, date_time } = body
    console.log({ id, first_name, last_name, domain, date_time });

    // Validate required fields
    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json({ error: "Missing required fields: id, first_name, last_name, domain" }, { status: 400 })
    }

    // Check if offer letter already exists
    const existingRecord = await prisma.offerLetter.findUnique({
      where: { submissionId: id },
    })

    if (existingRecord) {
      // Generate the download and view URLs
      const baseUrl = request.nextUrl.origin
      const downloadUrl = `${baseUrl}/api/download-pdf/${id}`
      const viewUrl = `${baseUrl}/api/view-pdf/${id}`

      return NextResponse.json({
        success: true,
        submissionId: id,
        candidateName: `${existingRecord.firstName} ${existingRecord.lastName}`,
        domain: existingRecord.domain,
        offerLetterUrl: downloadUrl, // This will download the PDF
        viewUrl: viewUrl, // This will open PDF in browser
        message: "Offer letter already exists",
      })
    }

    // Calculate internship dates (4 weeks duration as per template)
    const submissionDate = new Date(date_time)
    const startDate = new Date(submissionDate)
    startDate.setDate(startDate.getDate() + 7) // Start 1 week after submission

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 28) // 4 weeks (28 days) duration

    // Generate PDF
    console.log("📄 Generating PDF...")
    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: startDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      endDate: endDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      submissionId: id,
    })

    console.log(`✅ PDF generated, size: ${pdfBuffer.length} bytes`)

    // Upload to Cloudinary (for storage)
    const fileName = `Internship_Offer_Letter_${first_name}_${last_name}_${id}.pdf`
    console.log("☁️ Uploading to Cloudinary...")
    const cloudinaryUrl = await uploadToCloudinary(pdfBuffer, fileName)

    console.log(`✅ Upload successful: ${cloudinaryUrl}`)

    // Store in database
    const offerLetter = await prisma.offerLetter.create({
      data: {
        submissionId: id,
        firstName: first_name,
        lastName: last_name,
        domain,
        startDate,
        endDate,
        cloudinaryUrl, // Store Cloudinary URL for fetching
        submissionDateTime: new Date(date_time),
      },
    })

    // Generate the download and view URLs
    const baseUrl = request.nextUrl.origin
    const downloadUrl = `${baseUrl}/api/download-pdf/${id}`
    const viewUrl = `${baseUrl}/api/view-pdf/${id}`

    return NextResponse.json({
      success: true,
      submissionId: id,
      candidateName: `${first_name} ${last_name}`,
      domain,
      offerLetterUrl: downloadUrl, // This will download the PDF
      viewUrl: viewUrl, // This will open PDF in browser
      debug: {
        pdfSize: pdfBuffer.length,
        fileName,
        cloudinaryUrl, // Internal storage URL
      },
    })
  } catch (error) {
    console.error("Error generating offer letter:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
