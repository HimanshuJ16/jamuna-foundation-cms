import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await context.params // ✅ await here

    // Check if certificate exists
    const certificate = await prisma.certificate.findUnique({
      where: { submissionId },
    })

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      )
    }

    // Approve the certificate
    const updated = await prisma.certificate.update({
      where: { submissionId },
      data: { approved: true },
    })

    return NextResponse.json({
      success: true,
      message: "Certificate approved successfully",
      certificate: updated,
    })
  } catch (error) {
    console.error("Error approving certificate:", error)
    return NextResponse.json(
      { success: false, message: "Failed to approve certificate" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await context.params;

    // Check if certificate exists
    const certificate = await prisma.certificate.findUnique({
      where: { submissionId },
      select: { approved: true }, // Only select the approved field
    });

    if (!certificate) {
      return NextResponse.json(
        { success: false, message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isApproved: certificate.approved,
      message: `Certificate is ${certificate.approved ? "approved" : "not approved"}`,
    });
  } catch (error) {
    console.error("Error checking certificate approval:", error);
    return NextResponse.json(
      { isApproved: false, message: "Failed to check certificate approval" },
      { status: 500 }
    );
  }
}