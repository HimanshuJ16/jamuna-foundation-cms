import prisma from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

async function getRecentActivity() {
  // Get recent form submissions as webhook activity
  const submissions = await prisma.formSubmission.findMany({
    include: {
      contact: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return submissions
}

export default async function WebhooksPage() {
  const recentActivity = await getRecentActivity()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Webhook Activity</h1>
            <p className="text-muted-foreground mt-2">Monitor recent webhook activity and form submissions</p>
          </div>
          <Link href="/submissions">
            <Button>View All Submissions</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {recentActivity.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No webhook activity yet. Send a POST request to{" "}
                <code className="bg-muted px-2 py-1 rounded">/api/webhook</code>
              </p>
            </CardContent>
          </Card>
        ) : (
          recentActivity.map((activity) => (
            <Card key={activity.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{activity.formName || "Form Submission"}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">form_submission</Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <CardDescription>
                  Submission ID: {activity.submissionId || activity.id}
                  {activity.contact?.email && ` • ${activity.contact.email}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.contact && (
                    <div>
                      <h4 className="font-medium mb-2">Contact:</h4>
                      <div className="bg-muted p-3 rounded-md text-sm">
                        {activity.contact.name &&
                        typeof activity.contact.name === "object" &&
                        activity.contact.name !== null ? (
                          <div>
                            <strong>Name:</strong> {(activity.contact.name as any).first}{" "}
                            {(activity.contact.name as any).last}
                          </div>
                        ) : null}
                        {activity.contact.email && (
                          <div>
                            <strong>Email:</strong> {activity.contact.email}
                          </div>
                        )}
                        {activity.contact.phone && (
                          <div>
                            <strong>Phone:</strong> {activity.contact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activity.formFields && Object.keys(activity.formFields as object).length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Form Fields:</h4>
                      <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                        {JSON.stringify(activity.formFields, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
