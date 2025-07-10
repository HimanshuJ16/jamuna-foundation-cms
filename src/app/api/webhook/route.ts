import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Parse the form submission data
    let formData: any
    try {
      formData = JSON.parse(body)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 })
    }

    console.log("Received form submission:", {
      formName: formData.formName,
      submissionId: formData.submissionId,
      contactId: formData.contactId,
    })

    // Extract dynamic form fields (fields that start with "field:")
    const formFields: Record<string, any> = {}
    Object.keys(formData).forEach((key) => {
      if (key.startsWith("field:")) {
        formFields[key] = formData[key]
      }
    })

    // Handle contact data - create or update contact if it exists
    let contact = null
    if (formData.contact && formData.contactId) {
      contact = await prisma.contact.upsert({
        where: { contactId: formData.contactId },
        update: {
          email: formData.contact.email,
          phone: formData.contact.phone,
          locale: formData.contact.locale,
          company: formData.contact.company,
          birthdate: formData.contact.birthdate,
          jobTitle: formData.contact.jobTitle,
          imageUrl: formData.contact.imageUrl,
          updatedDate: formData.contact.updatedDate,
          createdDate: formData.contact.createdDate,
          name: formData.contact.name,
          address: formData.contact.address,
          labelKeys: formData.contact.labelKeys,
        },
        create: {
          contactId: formData.contactId,
          email: formData.contact.email,
          phone: formData.contact.phone,
          locale: formData.contact.locale,
          company: formData.contact.company,
          birthdate: formData.contact.birthdate,
          jobTitle: formData.contact.jobTitle,
          imageUrl: formData.contact.imageUrl,
          updatedDate: formData.contact.updatedDate,
          createdDate: formData.contact.createdDate,
          name: formData.contact.name,
          address: formData.contact.address,
          labelKeys: formData.contact.labelKeys,
        },
      })
    }

    // Create the form submission record
    const formSubmission = await prisma.formSubmission.create({
      data: {
        formName: formData.formName,
        formId: formData.formId,
        submissionId: formData.submissionId,
        contactId: formData.contactId,
        submissionTime: formData.submissionTime,
        submissionsLink: formData.submissionsLink,
        formFieldMask: formData.formFieldMask || [],
        formFields: formFields,
        triggeredEmails: formData["triggered-emails-1"] || null,
      },
    })

    // Create individual field submissions if submissions array exists
    if (formData.submissions && Array.isArray(formData.submissions)) {
      const fieldSubmissions = formData.submissions.map((submission: any) => ({
        label: submission.label,
        value: submission.value,
        submissionId: formSubmission.id,
      }))

      await prisma.formFieldSubmission.createMany({
        data: fieldSubmissions,
      })
    }

    console.log("Form submission stored successfully:", {
      id: formSubmission.id,
      formName: formSubmission.formName,
      contactId: formSubmission.contactId,
    })

    return NextResponse.json(
      {
        success: true,
        submissionId: formSubmission.id,
        formName: formSubmission.formName,
        message: "Form submission stored successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Form submission processing error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process form submission",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Optional: Handle GET requests to verify webhook endpoint
export async function GET() {
  return NextResponse.json(
    {
      message: "Webhook endpoint is active",
      timestamp: new Date().toISOString(),
    },
    { status: 200 },
  )
}
