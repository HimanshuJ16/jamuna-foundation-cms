import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/offer-letter-generator"
import { uploadToCloudinary } from "@/lib/cloudinary-storage"

const prisma = new PrismaClient()

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

      // Extract data from nested structure if available
      parsedData = rawBody.data || rawBody
    } else {
      // Try form data if JSON is not available
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        parsedData[key] = value
      }
    }

    console.log("📋 Parsed offer letter data:", parsedData)

    // Extract required and additional fields
    const {
      id, // required submission id
      first_name,
      last_name,
      domain,
      date_time,
      email,
      phone_number,
      learn_about_us,
      gender,
      joined_linkedin,
      college,
      academic_qualification,
      current_semester,
      resume,
      signature,
    } = parsedData

    // Validate required fields
    if (!id || !first_name || !last_name || !domain) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["id", "first_name", "last_name", "domain"],
          received: { id, first_name, last_name, domain },
          availableFields: Object.keys(parsedData),
        },
        { status: 400 },
      )
    }

    // Set default date_time if not provided
    const submissionTimestamp = date_time ? new Date(date_time) : new Date()
    if (!date_time) {
      console.log("📅 date_time not provided; using current timestamp:", submissionTimestamp.toISOString())
    }

    // Check if offer letter already exists
    const existingOfferLetter = await prisma.offerLetter.findUnique({
      where: { submissionId: id },
    }).catch(() => null)

    if (existingOfferLetter) {
      const baseUrl = request.nextUrl.origin
      const downloadUrl = `${baseUrl}/api/offer-letter/download-offer-letter/${id}`
      const viewUrl = `${baseUrl}/api/offer-letter/view-offer-letter/${id}`

      return NextResponse.json({
        success: true,
        submissionId: id,
        candidateName: `${existingOfferLetter.firstName} ${existingOfferLetter.lastName}`,
        domain: existingOfferLetter.domain,
        offerLetterUrl: downloadUrl,
        viewUrl: viewUrl,
        message: "Offer letter already exists",
      })
    }

    // Calculate internship start and end dates using rules:
    //  - If day of submission (date_time) is between 1 and 12, set startDate to 15th of the same month.
    //  - Otherwise, startDate is the 1st of the next month.
    const submissionDate = submissionTimestamp
    const startDate = new Date(submissionDate)
    const day = submissionDate.getDate()
    const month = submissionDate.getMonth()
    const year = submissionDate.getFullYear()

    if (day >= 1 && day <= 12) {
      startDate.setFullYear(year)
      startDate.setMonth(month)
      startDate.setDate(15)
    } else {
      startDate.setFullYear(year)
      startDate.setMonth(month + 1)
      startDate.setDate(1)
    }

    let endDate: Date
    if (startDate.getDate() === 15) {
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)
    } else {
      // Set endDate to the last day of the start month
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
    }

    // Format dates for PDF generation (using en-GB format)
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

    // Generate Offer Letter PDF
    console.log("📄 Generating offer letter PDF...")
    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      submissionId: id,
    })
    console.log(`✅ PDF generated, size: ${pdfBuffer.length} bytes`)

    // Upload to Cloudinary
    const fileName = `Internship_Offer_Letter_${first_name}_${last_name}_${id}.pdf`
    console.log("☁️ Uploading offer letter to Cloudinary...")
    const cloudinaryUrl = await uploadToCloudinary(pdfBuffer, fileName)
    console.log(`✅ Upload successful: ${cloudinaryUrl}`)

    // Store offer letter in database
    try {
      const offerLetter = await prisma.offerLetter.create({
        data: {
          submissionId: id,
          firstName: first_name,
          lastName: last_name,
          domain,
          startDate,
          endDate,
          cloudinaryUrl,
          submissionDateTime: submissionTimestamp,
          email: email || "",
          phoneNumber: phone_number || "",
          learnAboutUs: learn_about_us || "",
          gender: gender || "",
          joinedLinkedin: joined_linkedin || "",
          college: college || "",
          academicQualification: academic_qualification || "",
          currentSemester: current_semester || "",
          resume: resume || "",
          signature: signature || "",
        },
      })
      console.log("✅ Offer letter record saved to database")
    } catch (dbError) {
      console.warn("⚠️ Could not save to database:", dbError)
      // Optionally continue processing even if saving to the database fails
    }

    // Generate URLs for download and view
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
        formattedDates: { formattedStartDate, formattedEndDate },
      },
    })
  } catch (error) {
    console.error("❌ Error generating offer letter:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
