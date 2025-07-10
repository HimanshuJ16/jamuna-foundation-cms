import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { User, Mail, Phone, Building, Calendar } from "lucide-react"

async function getFormSubmissions() {
  const submissions = await prisma.formSubmission.findMany({
    include: {
      contact: true,
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  return submissions
}

export default async function SubmissionsPage() {
  const submissions = await getFormSubmissions()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Submissions</h1>
        <p className="text-muted-foreground mt-2">View and manage incoming form submissions</p>
      </div>

      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No form submissions received yet. Send form data to{" "}
                <code className="bg-muted px-2 py-1 rounded">/api/webhook</code>
              </p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission: any) => (
            <Card key={submission.id} className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{submission.formName || "Untitled Form"}</CardTitle>
                    <CardDescription>Submission ID: {submission.submissionId || submission.id}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{formatDistanceToNow(submission.createdAt, { addSuffix: true })}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contact Information */}
                {submission.contact && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {submission.contact.name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {typeof submission.contact.name === "object" && submission.contact.name !== null
                                ? `${(submission.contact.name as any).first || ""} ${(submission.contact.name as any).last || ""}`.trim()
                                : "N/A"}
                            </span>
                          </div>
                        )}
                        {submission.contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{submission.contact.email}</span>
                          </div>
                        )}
                        {submission.contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{submission.contact.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {submission.contact.company && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{submission.contact.company}</span>
                          </div>
                        )}
                        {submission.contact.jobTitle && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{submission.contact.jobTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                {submission.formFields && Object.keys(submission.formFields as object).length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Form Fields</h3>
                    <div className="grid gap-3">
                      {Object.entries(submission.formFields as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {key.replace("field:", "").replace(/_/g, " ").toUpperCase()}
                          </span>
                          <span className="text-sm bg-muted p-2 rounded">
                            {typeof value === "string" ? value : JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Submissions */}
                {submission.submissions && submission.submissions.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Field Submissions</h3>
                    <div className="grid gap-3">
                      {submission.submissions.map((fieldSubmission: any) => (
                        <div key={fieldSubmission.id} className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-muted-foreground">{fieldSubmission.label}</span>
                          <span className="text-sm bg-muted p-2 rounded">{fieldSubmission.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Submission Details</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Form ID:</span> {submission.formId || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Submission Time:</span> {submission.submissionTime || "N/A"}
                    </div>
                    {submission.submissionsLink && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Submissions Link:</span>{" "}
                        <a
                          href={submission.submissionsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Original
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
