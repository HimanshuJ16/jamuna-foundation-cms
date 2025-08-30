import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { generateOfferLetterPDF } from "@/lib/offer-letter-generator"
import { uploadToCloudinary } from "@/lib/cloudinary-storage"
import { sendInternshipApplicationEmail } from "@/lib/email"

const prisma = new PrismaClient()

// ✅ Google Drive task link mapping
const taskLinksByDomain: Record<string, string> = {
  "Web Development": "https://drive.google.com/file/d/1qHVRN5WSVr8wtBcGcm7WRWDtq7aDpaUW/view?usp=sharing",
  "Android App Development": "https://drive.google.com/file/d/12yIhG_iDnKNQ8eBuwx-q1G6R6hU20F-5/view?usp=drive_link",
  "Data Science": "https://drive.google.com/file/d/1t2yWQYlSLniWS4Xcc_m50gaP36PjN5ip/view?usp=drive_link",
  "UI/UX Design": "https://drive.google.com/file/d/1DN8cfbh1Q-mooFmwpa5L74_eX-vf18rp/view?usp=drive_link",
  "Machine Learning": "https://drive.google.com/file/d/1VMtWpsRez0a8PvGqNq696HIwtD6ZNXci/view?usp=drive_link",
  "Python Programming": "https://drive.google.com/file/d/1wbrWmrAvl1tkbVyVUQnX06F3Sb_seAoq/view?usp=sharing",
  "C++ Programming": "https://drive.google.com/file/d/1U3BsUNMI94lp8Ceg8mSmSVqzvUy4ctGj/view?usp=sharing",
}

// ✅ Fallback task link
const fallbackTaskLink = "https://drive.google.com/drive/folders/1h4SHZvmquQKFmHlt4M5jdjQ6vJ5POSDN?usp=sharing"

export async function POST(request: NextRequest) {
  try {
    let parsedData: any = {}

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("application/json")) {
      const rawBody = await request.json()
      if (process.env.NODE_ENV !== "production") {
        console.log("🔍 Raw JSON body:", rawBody)
      }
      parsedData = rawBody.data || rawBody
    } else {
      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        parsedData[key] = value
      }
    }

    const {
      id,
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

    const submissionTimestamp = date_time ? new Date(date_time) : new Date()

    const existingOfferLetter = await prisma.offerLetter.findUnique({
      where: { submissionId: id },
    }).catch(() => null)

    const baseUrl = request.nextUrl.origin

    if (existingOfferLetter) {
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

    const submissionDate = submissionTimestamp
    const startDate = new Date(submissionDate)
    const day = submissionDate.getDate()
    const month = submissionDate.getMonth()
    const year = submissionDate.getFullYear()

    if (day >= 1 && day <= 12) {
      startDate.setFullYear(year, month, 15)
    } else if (day >= 13 && day <= 27) {
      startDate.setFullYear(year, month + 1, 1)
    } else {
      startDate.setFullYear(year, month + 1, 15)
    }

    let endDate: Date
    if (startDate.getDate() === 15) {
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)
    } else {
      endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
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

    const formattedFirstName = first_name.toLowerCase().split(" ").filter(Boolean).map(
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");     
    const formattedLastName = last_name.toLowerCase().split(" ").filter(Boolean).map(
      (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" "); 

    const pdfBuffer = await generateOfferLetterPDF({
      candidateName: `${formattedFirstName} ${formattedLastName}`,
      domain,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      submissionId: id,
    })

    const fileName = `Internship_Offer_Letter_${formattedFirstName}_${formattedLastName}_${id}.pdf`
    const cloudinaryUrl = await uploadToCloudinary(pdfBuffer, fileName)

    try {
      await prisma.offerLetter.create({
        data: {
          submissionId: id,
          firstName: formattedFirstName,
          lastName: formattedLastName,
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

      // Send the email after successfully creating the offer letter in the DB
      await sendInternshipApplicationEmail(
        id,
        formattedFirstName,
        email || "himanshujangir16@gmail.com",
        domain
      );
    } catch (dbError) {
      console.warn("⚠️ Database insert failed:", dbError)
    }

    const downloadUrl = `${baseUrl}/api/offer-letter/download-offer-letter/${id}`
    const viewUrl = `${baseUrl}/api/offer-letter/view-offer-letter/${id}`

    // ✅ Normalize domain & resolve task link
    const normalizedDomain = domain.trim().toLowerCase()
    const taskLink =
      Object.entries(taskLinksByDomain).find(([key]) => key.toLowerCase() === normalizedDomain)?.[1] ||
      fallbackTaskLink 

    return NextResponse.json({
      success: true,
      submissionId: id,
      candidateName: `${formattedFirstName} ${formattedLastName}`,
      domain,
      offerLetterUrl: downloadUrl,
      viewUrl: viewUrl,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      taskLink,
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
