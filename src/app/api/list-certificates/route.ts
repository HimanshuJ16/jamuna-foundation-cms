import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const domain = searchParams.get("domain")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (domain) {
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

    // Get certificates with pagination
    const [certificates, total] = await Promise.all([
      prisma.certificate
        .findMany({
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
            tasksPerformed: true,
            linkedinTask1: true,
            linkedinTask2: true,
            linkedinTask3: true,
            githubTask1: true,
            githubTask2: true,
            githubTask3: true,
            hostedWebsite: true,
            experienceLink: true,
            donation: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        })
        .catch(() => []),
      prisma.certificate.count({ where }).catch(() => 0),
    ])

    // Process certificates to include link counts
    const processedCertificates = certificates.map((cert) => {
      const linkedinLinks = [cert.linkedinTask1, cert.linkedinTask2, cert.linkedinTask3].filter(Boolean)
      const githubLinks = [cert.githubTask1, cert.githubTask2, cert.githubTask3].filter(Boolean)

      return {
        ...cert,
        candidateName: `${cert.firstName} ${cert.lastName}`,
        linkedinLinksCount: linkedinLinks.length,
        githubLinksCount: githubLinks.length,
        hasHostedWebsite: !!cert.hostedWebsite,
        hasExperienceLink: !!cert.experienceLink,
        hasDonation: !!cert.donation,
      }
    })

    return NextResponse.json({
      success: true,
      certificates: processedCertificates,
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
    console.error("Error listing certificates:", error)
    return NextResponse.json(
      {
        error: "Failed to list certificates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
