import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: submissionId } = await params

    console.log("🔍 Verifying certificate with ID:", submissionId)

    // Find the certificate record
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
          cloudinaryUrl: true,
          submissionDateTime: true,
          createdAt: true,
        },
      })
      .catch(() => null)

    if (!certificate) {
      console.log("❌ Certificate not found:", submissionId)
      return NextResponse.json(
        {
          success: false,
          error: "Certificate not found",
          verified: false,
          submissionId,
        },
        { status: 404 },
      )
    }

    console.log("✅ Certificate verified successfully:", submissionId)

    // Return verification result
    return NextResponse.json({
      success: true,
      verified: true,
      certificate: {
        ...certificate,
        candidateName: `${certificate.firstName} ${certificate.lastName}`,
      },
      verificationTimestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Error verifying certificate:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Verification failed",
        verified: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
