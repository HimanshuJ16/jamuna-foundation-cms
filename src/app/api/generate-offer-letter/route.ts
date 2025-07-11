import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/pdf-generator"
import { uploadToCloudinary } from "@/lib/cloudinary-storage"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    let id, first_name, last_name, domain, date_time

    // Check Content-Type to determine how to parse the body
    const contentType = request.headers.get("content-type") || ""

    console.log("📥 Content-Type:", contentType)

    if (contentType.includes("application/json")) {
      // Parse as JSON
      console.log("📝 Parsing as JSON...")
      const body = await request.json()
      ;({ id, first_name, last_name, domain, date_time } = body)
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Parse as form data
      console.log("📝 Parsing as form data...")
      const formData = await request.formData()
      id = formData.get("id")?.toString()
      first_name = formData.get("first_name")?.toString()
      last_name = formData.get("last_name")?.toString()
      domain = formData.get("domain")?.toString()
      date_time = formData.get("date_time")?.toString()
    } else {
      // Try both methods as fallback
      console.log("📝 Trying to parse as form data first...")
      try {
        const formData = await request.formData()
        id = formData.get("id")?.toString()
        first_name = formData.get("first_name")?.toString()
        last_name = formData.get("last_name")?.toString()
        domain = formData.get("domain")?.toString()
        date_time = formData.get("date_time")?.toString()

        // If form data parsing didn't work, try JSON
        if (!id && !first_name && !last_name && !domain) {
          console.log("📝 Form data empty, trying JSON...")
          const body = await request.json()
          ;({ id, first_name, last_name, domain, date_time } = body)
        }
      } catch (formError) {
        console.log("📝 Form data failed, trying JSON...")
        const body = await request.json()
        ;({ id, first_name, last_name, domain, date_time } = body)
      }
    }

    console.log("📋 Parsed data:", { id, first_name, last_name, domain, date_time })

    // Validate required fields
    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json(
        {
          error: "Missing required fields: id, first_name, last_name, domain",
          received: { id, first_name, last_name, domain, date_time },
        },
        { status: 400 },
      )
    }

    // Set default date_time if not provided
    if (!date_time) {
      date_time = new Date().toISOString()
      console.log("📅 Using default date_time:", date_time)
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
        offerLetterUrl: downloadUrl,
        viewUrl: viewUrl,
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
        cloudinaryUrl,
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
      offerLetterUrl: downloadUrl,
      viewUrl: viewUrl,
      debug: {
        pdfSize: pdfBuffer.length,
        fileName,
        cloudinaryUrl,
        contentType,
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
