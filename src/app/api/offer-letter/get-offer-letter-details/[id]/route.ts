import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: submissionId } = params

    // Find the offer letter record with all stored details
    const offerLetter = await prisma.offerLetter
      .findUnique({
        where: { submissionId },
        select: {
          id: true,
          submissionId: true,
          firstName: true,
          lastName: true,
          email: true,
          phoneNumber: true,
          domain: true,
          startDate: true,
          endDate: true,
          college: true,
          academicQualification: true,
          currentSemester: true,
          learnAboutUs: true,
          gender: true,
          joinedLinkedin: true,
          resume: true,
          signature: true,
          cloudinaryUrl: true,
          submissionDateTime: true,
          createdAt: true,
        },
      })
      .catch(() => null)

    if (!offerLetter) {
      return NextResponse.json({ error: "Offer letter not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      offerLetter: {
        ...offerLetter,
        candidateName: `${offerLetter.firstName} ${offerLetter.lastName}`,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching offer letter details:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch offer letter details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
