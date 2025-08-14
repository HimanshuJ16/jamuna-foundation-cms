import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateCertificatePDF } from "@/lib/certificate-generator"
import { uploadCertificateToCloudinary } from "@/lib/cloudinary-storage"

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

      // Extract data from nested structure
      parsedData = rawBody.data || rawBody
    } else {
      // Try form data
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        parsedData[key] = value
      }
    }

    console.log("📋 Parsed certificate data:", parsedData)

    // Extract required fields
    const {
      first_name,
      last_name,
      submission_id,
      email,
      domain,
      start_date,
      end_date,
      tasks_performed,
      date_time,
      linkedin_task1,
      linkedin_task2,
      linkedin_task3,
      linkedin_task4,
      linkedin_task5,
      github_task1,
      github_task2,
      github_task3,
      github_task4,
      github_task5,
      hosted_website,
      experience_link,
      donation,
      status,
    } = parsedData

    // Validate required fields
    if (!submission_id || !first_name || !last_name || !domain || !start_date || !end_date) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["submission_id", "first_name", "last_name", "domain", "start_date", "end_date"],
          received: { submission_id, first_name, last_name, domain, start_date, end_date },
          availableFields: Object.keys(parsedData),
        },
        { status: 400 },
      )
    }

    // Check if certificate already exists
    const existingCertificate = await prisma.certificate
      .findUnique({
        where: { submissionId: submission_id },
      })
      .catch(() => null) // Handle if table doesn't exist yet

    if (existingCertificate) {
      const baseUrl = request.nextUrl.origin
      const downloadUrl = `${baseUrl}/api/certificate/download-certificate/${submission_id}`
      const viewUrl = `${baseUrl}/api/certificate/view-certificate/${submission_id}`

      return NextResponse.json({
        success: true,
        submissionId: submission_id,
        candidateName: `${first_name} ${last_name}`,
        domain,
        certificateUrl: downloadUrl,
        viewUrl: viewUrl,
        message: "Certificate already exists",
      })
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

    // Generate certificate PDF
    console.log("📜 Generating certificate...")
    const pdfBuffer = await generateCertificatePDF({
      candidateName: `${first_name} ${last_name}`,
      domain,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      submissionId: submission_id,
    })

    console.log(`✅ Certificate generated, size: ${pdfBuffer.length} bytes`)

    // Upload to Cloudinary using the certificate-specific function
    const fileName = `Internship_Certificate_${first_name}_${last_name}_${submission_id}.pdf`
    console.log("☁️ Uploading certificate to Cloudinary (certificates folder)...")
    const cloudinaryUrl = await uploadCertificateToCloudinary(pdfBuffer, fileName)

    console.log(`✅ Certificate upload successful: ${cloudinaryUrl}`)

    // Store in database (create table if it doesn't exist)
    try {
      const certificate = await prisma.certificate.create({
        data: {
          submissionId: submission_id,
          firstName: first_name,
          lastName: last_name,
          email: email || "",
          domain,
          startDate: new Date(start_date),
          endDate: new Date(end_date),
          tasksPerformed: Number.parseInt(tasks_performed || "0"),
          linkedinTask1: linkedin_task1 || null,
          linkedinTask2: linkedin_task2 || null,
          linkedinTask3: linkedin_task3 || null,
          linkedinTask4: linkedin_task4 || null,
          linkedinTask5: linkedin_task5 || null,
          githubTask1: github_task1 || null,
          githubTask2: github_task2 || null,
          githubTask3: github_task3 || null,
          githubTask4: github_task4 || null,
          githubTask5: github_task5 || null,
          hostedWebsite: hosted_website || null,
          experienceLink: experience_link || null,
          status: status || null,
          donation: donation || null,
          cloudinaryUrl,
          submissionDateTime: new Date(date_time || new Date()),
        },
      })
      console.log("✅ Certificate record saved to database with all links")
    } catch (dbError) {
      console.warn("⚠️ Could not save to database:", dbError)
      // Continue without database storage for now
    }

    // Generate URLs
    const baseUrl = request.nextUrl.origin
    const downloadUrl = `${baseUrl}/api/certificate/download-certificate/${submission_id}`
    const viewUrl = `${baseUrl}/api/certificate/view-certificate/${submission_id}`

    return NextResponse.json({
      success: true,
      submissionId: submission_id,
      candidateName: `${first_name} ${last_name}`,
      domain,
      certificateUrl: downloadUrl,
      viewUrl: viewUrl,
      debug: {
        pdfSize: pdfBuffer.length,
        fileName,
        cloudinaryUrl,
        cloudinaryFolder: "internship-certificates",
        contentType,
        tasksPerformed: tasks_performed,
        formattedDates: { formattedStartDate, formattedEndDate },
        linksStored: {
          linkedinLinks: [linkedin_task1, linkedin_task2, linkedin_task3, linkedin_task4, linkedin_task5].filter(
            Boolean,
          ).length,
          githubLinks: [github_task1, github_task2, github_task3, github_task4, github_task5].filter(Boolean).length,
          hostedWebsite: !!hosted_website,
          experienceLink: !!experience_link,
          donation: !!donation,
        },
      },
    })
  } catch (error) {
    console.error("❌ Error generating certificate:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
