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

    // Get certificates with pagination
    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
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
          linkedinTask4: true,
          linkedinTask5: true,
          githubTask1: true,
          githubTask2: true,
          githubTask3: true,
          githubTask4: true,
          githubTask5: true,
          hostedWebsite: true,
          experienceLink: true,
          donation: true,
          approved: true, // Include approved field
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }).catch(() => []),
      prisma.certificate.count({ where }).catch(() => 0),
    ])

    // Process certificates to include link counts
    const processedCertificates = certificates.map((cert) => {
      const linkedinLinks = [
        cert.linkedinTask1,
        cert.linkedinTask2,
        cert.linkedinTask3,
        cert.linkedinTask4,
        cert.linkedinTask5,
      ].filter(Boolean)
      const githubLinks = [
        cert.githubTask1,
        cert.githubTask2,
        cert.githubTask3,
        cert.githubTask4,
        cert.githubTask5,
      ].filter(Boolean)

      return {
        id: cert.id,
        submissionId: cert.submissionId,
        candidateName: `${cert.firstName} ${cert.lastName}`,
        email: cert.email || "",
        domain: cert.domain,
        startDate: cert.startDate.toISOString(),
        endDate: cert.endDate.toISOString(),
        tasksPerformed: cert.tasksPerformed,
        linkedinLinksCount: linkedinLinks.length,
        githubLinksCount: githubLinks.length,
        hasHostedWebsite: !!cert.hostedWebsite,
        hasExperienceLink: !!cert.experienceLink,
        hasDonation: !!cert.donation,
        approved: cert.approved,
        createdAt: cert.createdAt.toISOString(),
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
  } finally {
    await prisma.$disconnect()
  }
}