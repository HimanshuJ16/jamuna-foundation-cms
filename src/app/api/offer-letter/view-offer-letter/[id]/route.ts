import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: submissionId } = await params

    // Find the offer letter record
    const offerLetter = await prisma.offerLetter.findUnique({
      where: { submissionId },
    })

    if (!offerLetter) {
      return NextResponse.json({ error: "Offer letter not found" }, { status: 404 })
    }

    // Fetch the PDF from Cloudinary
    const response = await fetch(offerLetter.cloudinaryUrl)

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    // Create the filename
    const fileName = `Internship_Offer_Letter_${offerLetter.firstName}_${offerLetter.lastName}_${submissionId}.pdf`

    // Return the PDF for inline viewing (opens in browser)
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
    console.error("Error serving PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to serve PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
