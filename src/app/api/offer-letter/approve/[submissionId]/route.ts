// File: app/api/offer-letter/approve/[submissionId]/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PATCH(
  request: Request,
  context: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await context.params

    // Check if offer letter exists
    const offerLetter = await prisma.offerLetter.findUnique({
      where: { submissionId },
    })

    if (!offerLetter) {
      return NextResponse.json(
        { success: false, message: "Offer letter not found" },
        { status: 404 }
      )
    }

    // Approve the offer letter
    const updated = await prisma.offerLetter.update({
      where: { submissionId },
      data: { approved: true },
    })

    return NextResponse.json({
      success: true,
      message: "Offer letter approved successfully",
      offerLetter: updated,
    })
  } catch (error) {
    console.error("Error approving offer letter:", error)
    return NextResponse.json(
      { success: false, message: "Failed to approve offer letter" },
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

    // Check if offer letter exists
    const offerLetter = await prisma.offerLetter.findUnique({
      where: { submissionId },
      select: { approved: true }, // Only select the approved field
    });

    if (!offerLetter) {
      return NextResponse.json(
        { success: false, message: "Offer letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      isApproved: offerLetter.approved,
      message: `Offer letter is ${offerLetter.approved ? "approved" : "not approved"}`,
    });
  } catch (error) {
    console.error("Error checking offer letter approval:", error);
    return NextResponse.json(
      { isApproved: false, message: "Failed to check offer letter approval" },
      { status: 500 }
    );
  }
}