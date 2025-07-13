import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: submissionId } = await params

    // Find the certificate record with all details
    const certificate = await prisma.certificate
      .findUnique({
        where: { submissionId },
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
          cloudinaryUrl: true,
          submissionDateTime: true,
          createdAt: true,
        },
      })
      .catch(() => null)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Organize the links for easier consumption
    const linkedinLinks = [
      certificate.linkedinTask1,
      certificate.linkedinTask2,
      certificate.linkedinTask3,
      certificate.linkedinTask4,
      certificate.linkedinTask5,
    ].filter(Boolean)

    const githubLinks = [
      certificate.githubTask1,
      certificate.githubTask2,
      certificate.githubTask3,
      certificate.githubTask4,
      certificate.githubTask5,
    ].filter(Boolean)

    return NextResponse.json({
      success: true,
      certificate: {
        ...certificate,
        candidateName: `${certificate.firstName} ${certificate.lastName}`,
        linkedinLinks,
        githubLinks,
        totalLinkedinLinks: linkedinLinks.length,
        totalGithubLinks: githubLinks.length,
      },
    })
  } catch (error) {
    console.error("Error fetching certificate details:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch certificate details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
