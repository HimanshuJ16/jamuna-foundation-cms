import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const domain = searchParams.get("domain") || ""
    const search = searchParams.get("search") || ""
    const approved = searchParams.get("approved") === "true" // Parse approved as boolean

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      approved, // Filter by approval status
    }

    if (domain && domain !== "All domains") {
      where.domain = domain
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { submissionId: { contains: search, mode: "insensitive" } },
      ]
    }

    // Get offer letters with pagination
    const [offerLetters, total] = await Promise.all([
      prisma.offerLetter.findMany({
        where,
        select: {
          id: true,
          submissionId: true,
          firstName: true,
          lastName: true,
          email: true,
          domain: true,
          startDate: true,
          endDate: true,
          college: true,
          academicQualification: true,
          currentSemester: true,
          phoneNumber: true,
          gender: true,
          joinedLinkedin: true,
          learnAboutUs: true,
          resume: true,
          signature: true,
          approved: true, // Include approved field
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }).catch(() => []),
      prisma.offerLetter.count({ where }).catch(() => 0),
    ])

    // Process offer letters to include additional info
    const processedLetters = offerLetters.map((letter) => ({
      ...letter,
      candidateName: `${letter.firstName} ${letter.lastName}`,
      hasResume: !!letter.resume,
      hasSignature: !!letter.signature,
    }))

    return NextResponse.json({
      success: true,
      offerLetters: processedLetters,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error listing offer letters:", error)
    return NextResponse.json(
      {
        error: "Failed to list offer letters",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}