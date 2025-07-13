import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/offer-letter-generator"
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

      // Check if data is nested inside a 'data' object (Wix format)
      const dataSource = rawBody.data || rawBody

      console.log("🔍 Data source:", JSON.stringify(dataSource, null, 2))
      console.log("🔑 Data source keys:", Object.keys(dataSource))

      // Extract fields from the correct data source
      id = dataSource.id || dataSource.submissionId || dataSource.submission_id || dataSource.ID
      first_name = dataSource.first_name || dataSource.firstName || dataSource.fname || dataSource.name?.first
      last_name = dataSource.last_name || dataSource.lastName || dataSource.lname || dataSource.name?.last
      domain = dataSource.domain || dataSource.internshipDomain || dataSource.preferred_domain || dataSource.field
      date_time =
        dataSource.date_time ||
        dataSource.dateTime ||
        dataSource.timestamp ||
        dataSource.submissionTime ||
        dataSource.createdAt
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
        id = formData.get("id")?.toString()
        first_name = formData.get("first_name")?.toString()
        last_name = formData.get("last_name")?.toString()
        domain = formData.get("domain")?.toString()
        date_time = formData.get("date_time")?.toString()

        if (!id && !first_name && !last_name && !domain) {
          console.log("📝 Form data empty, trying JSON...")
          rawBody = await request.json()
          const dataSource = rawBody.data || rawBody

          id = dataSource.id || dataSource.submissionId || dataSource.submission_id
          first_name = dataSource.first_name || dataSource.firstName || dataSource.fname
          last_name = dataSource.last_name || dataSource.lastName || dataSource.lname
          domain = dataSource.domain || dataSource.internshipDomain || dataSource.preferred_domain
          date_time = dataSource.date_time || dataSource.dateTime || dataSource.timestamp
        }
      } catch (formError) {
        console.log("📝 Form data failed, trying JSON...")
        rawBody = await request.json()
        const dataSource = rawBody.data || rawBody

        id = dataSource.id || dataSource.submissionId || dataSource.submission_id
        first_name = dataSource.first_name || dataSource.firstName || dataSource.fname
        last_name = dataSource.last_name || dataSource.lastName || dataSource.lname
        domain = dataSource.domain || dataSource.internshipDomain || dataSource.preferred_domain
        date_time = dataSource.date_time || dataSource.dateTime || dataSource.timestamp
      }
    }

    console.log("📋 Parsed data:", { id, first_name, last_name, domain, date_time })

    // Validate required fields
    if (!id || !first_name || !last_name || !domain) {
      const dataSource = rawBody.data || rawBody
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["id", "first_name", "last_name", "domain"],
          received: { id, first_name, last_name, domain, date_time },
          availableFields: Object.keys(dataSource),
          rawData: dataSource,
          isNestedInData: !!rawBody.data,
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
      const downloadUrl = `${baseUrl}/api/offer-letter/download-offer-letter/${id}`
      const viewUrl = `${baseUrl}/api/offer-letter/view-offer-letter/${id}`

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
    const downloadUrl = `${baseUrl}/api/offer-letter/download-offer-letter/${id}`
    const viewUrl = `${baseUrl}/api/offer-letter/view-offer-letter/${id}`

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
        wasNestedInData: !!rawBody.data,
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
