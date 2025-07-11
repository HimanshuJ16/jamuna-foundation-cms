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

    // Parse the request body
    let rawBody: any = {}

    if (contentType.includes("application/json")) {
      console.log("📝 Parsing as JSON...")
      rawBody = await request.json()
      console.log("🔍 Raw JSON body received:", JSON.stringify(rawBody, null, 2))
      console.log("🔍 Raw body keys:", Object.keys(rawBody))

      // Try different possible field name variations from Wix
      id = rawBody.id || rawBody.submissionId || rawBody.submission_id || rawBody.ID
      first_name = rawBody.first_name || rawBody.firstName || rawBody.fname || rawBody.name?.first
      last_name = rawBody.last_name || rawBody.lastName || rawBody.lname || rawBody.name?.last
      domain = rawBody.domain || rawBody.internshipDomain || rawBody.preferred_domain || rawBody.field
      date_time =
        rawBody.date_time || rawBody.dateTime || rawBody.timestamp || rawBody.submissionTime || rawBody.createdAt
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      console.log("📝 Parsing as form data...")
      const formData = await request.formData()
      console.log("🔍 Form data entries:")
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`)
      }

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
        console.log("🔍 Form data entries:")
        for (const [key, value] of formData.entries()) {
          console.log(`  ${key}: ${value}`)
        }

        id = formData.get("id")?.toString()
        first_name = formData.get("first_name")?.toString()
        last_name = formData.get("last_name")?.toString()
        domain = formData.get("domain")?.toString()
        date_time = formData.get("date_time")?.toString()

        if (!id && !first_name && !last_name && !domain) {
          console.log("📝 Form data empty, trying JSON...")
          const body = await request.json()
          rawBody = body
          console.log("🔍 Raw JSON body received:", JSON.stringify(rawBody, null, 2))

          id = rawBody.id || rawBody.submissionId || rawBody.submission_id
          first_name = rawBody.first_name || rawBody.firstName || rawBody.fname
          last_name = rawBody.last_name || rawBody.lastName || rawBody.lname
          domain = rawBody.domain || rawBody.internshipDomain || rawBody.preferred_domain
          date_time = rawBody.date_time || rawBody.dateTime || rawBody.timestamp
        }
      } catch (formError) {
        console.log("📝 Form data failed, trying JSON...")
        rawBody = await request.json()
        console.log("🔍 Raw JSON body received:", JSON.stringify(rawBody, null, 2))

        id = rawBody.id || rawBody.submissionId || rawBody.submission_id
        first_name = rawBody.first_name || rawBody.firstName || rawBody.fname
        last_name = rawBody.last_name || rawBody.lastName || rawBody.lname
        domain = rawBody.domain || rawBody.internshipDomain || rawBody.preferred_domain
        date_time = rawBody.date_time || rawBody.dateTime || rawBody.timestamp
      }
    }

    console.log("📋 Parsed data:", { id, first_name, last_name, domain, date_time })
    console.log("🔍 All available fields in request:", Object.keys(rawBody))

    // If we still don't have the required fields, return detailed error
    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["id", "first_name", "last_name", "domain"],
          received: { id, first_name, last_name, domain, date_time },
          availableFields: Object.keys(rawBody),
          rawData: rawBody,
          suggestions: {
            id: "Try: submissionId, submission_id, ID",
            first_name: "Try: firstName, fname, name.first",
            last_name: "Try: lastName, lname, name.last",
            domain: "Try: internshipDomain, preferred_domain, field",
          },
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
    startDate.setDate(startDate.getDate() + 7)

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 28)

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

    // Upload to Cloudinary
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

    // Generate URLs
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
        originalFields: Object.keys(rawBody),
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
