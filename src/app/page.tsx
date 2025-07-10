import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Webhook, Database, Eye } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Webhook Data Storage</h1>
        <p className="text-xl text-muted-foreground">Receive and store webhook data in PostgreSQL using Prisma</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Webhook Endpoints
            </CardTitle>
            <CardDescription>Available endpoints for receiving webhook data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">POST /api/webhook</code>
              <p className="text-xs text-muted-foreground mt-1">General webhook endpoint</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-sm">POST /api/webhook/[source]</code>
              <p className="text-xs text-muted-foreground mt-1">Source-specific webhook endpoint</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Storage
            </CardTitle>
            <CardDescription>Automatic storage in PostgreSQL database</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• JSON payload storage</li>
              <li>• Request headers capture</li>
              <li>• Source identification</li>
              <li>• Event type detection</li>
              <li>• Timestamp tracking</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Monitoring
            </CardTitle>
            <CardDescription>View and monitor form submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/submissions">
              <Button className="w-full">View Form Submissions</Button>
            </Link>
            <Link href="/webhooks">
              <Button variant="outline" className="w-full bg-transparent">
                Raw Webhook Data
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Example Usage</CardTitle>
          <CardDescription>Test your webhook endpoint with sample form data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Form submission test:</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {`curl -X POST http://localhost:3000/api/webhook \\
  -H "Content-Type: application/json" \\
  -d '{
    "formName": "Internship Application",
    "formId": "form_123",
    "submissionId": "sub_456",
    "contactId": "contact_789",
    "submissionTime": "2024-01-15T10:30:00Z",
    "field:email_78b3": "john@example.com",
    "field:first_name_d7a2": "John",
    "field:last_name_1f77": "Doe",
    "contact": {
      "name": {"first": "John", "last": "Doe"},
      "email": "john@example.com",
      "contactId": "contact_789"
    },
    "submissions": [
      {"label": "Email", "value": "john@example.com"},
      {"label": "First Name", "value": "John"}
    ]
  }'`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
