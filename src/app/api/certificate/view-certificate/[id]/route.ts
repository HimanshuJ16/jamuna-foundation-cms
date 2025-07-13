import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: submissionId } = await params

    // Find the certificate record
    const certificate = await prisma.certificate
      .findUnique({
        where: { submissionId },
      })
      .catch(() => null)

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 })
    }

    // Fetch the PDF from Cloudinary
    const response = await fetch(certificate.cloudinaryUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch certificate: ${response.status} ${response.statusText}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    // Create the filename
    const fileName = `Internship_Certificate_${certificate.firstName}_${certificate.lastName}_${submissionId}.pdf`

    // Return the PDF for inline viewing
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error serving certificate:", error)
    return NextResponse.json(
      {
        error: "Failed to serve certificate",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
