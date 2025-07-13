"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Download, Eye, Award } from "lucide-react"
import { CertificatePreview } from "@/components/certificate-preview"

export default function CertificatePage() {
  const [formData, setFormData] = useState({
    submission_id: "",
    first_name: "",
    last_name: "",
    email: "",
    domain: "",
    start_date: "",
    end_date: "",
    tasks_performed: "3",
    linkedin_task1: "",
    linkedin_task2: "",
    linkedin_task3: "",
    github_task1: "",
    github_task2: "",
    github_task3: "",
    hosted_website: "",
    experience_link: "",
    donation: "",
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  // Check if form is valid for preview
  const isFormValid = useMemo(() => {
    return !!(
      formData.submission_id &&
      formData.first_name &&
      formData.last_name &&
      formData.domain &&
      formData.start_date &&
      formData.end_date
    )
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/generate-certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            ...formData,
            date_time: new Date().toISOString(),
          },
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data)
        toast("Success!", {
          description: "Certificate generated successfully",
        })
      } else {
        throw new Error(data.error || "Failed to generate certificate")
      }
    } catch (error) {
      toast("Error", {
        description: error instanceof Error ? error.message : "Failed to generate certificate",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="w-8 h-8" />
          Certificate Generator
        </h1>
        <p className="text-muted-foreground">Generate internship completion certificates</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Form and Response */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Internship Certificate</CardTitle>
              <CardDescription>Fill out the form to generate a personalized internship certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submission_id">Submission ID</Label>
                  <Input
                    id="submission_id"
                    value={formData.submission_id}
                    onChange={(e) => setFormData({ ...formData, submission_id: e.target.value })}
                    placeholder="Enter submission ID"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="domain">Internship Domain</Label>
                  <Select
                    value={formData.domain}
                    onValueChange={(value) => setFormData({ ...formData, domain: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select internship domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="Data Science">Data Science</SelectItem>
                      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                      <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Android App Development">Android App Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating..." : "Generate Certificate"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* API Response Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>The generated certificate details will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">🏆 Certificate Generated!</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Submission ID:</strong> {response.submissionId}
                      </p>
                      <p>
                        <strong>Candidate:</strong> {response.candidateName}
                      </p>
                      <p>
                        <strong>Domain:</strong> {response.domain}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <a href={response.certificateUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download Certificate
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                            <a href={response.viewUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              View Certificate
                            </a>
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>
                            <strong>Download URL:</strong> {response.certificateUrl}
                          </p>
                          <p>
                            <strong>View URL:</strong> {response.viewUrl}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">Submit the form to see the API response</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <CertificatePreview formData={formData} isFormValid={isFormValid} />
      </div>

      {/* API Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Certificate API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Certificate Generation Endpoint</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/generate-certificate</code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Certificate Preview Endpoint</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/preview-certificate</code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Request Body (Wix Format)</h3>
              <Textarea
                readOnly
                value={`{
  "data": {
    "first_name": "Himanshu",
    "last_name": "Jangir",
    "submission_id": "38afcad3-f5d0-477d-b4e2-6a351912509d",
    "email": "himanshujangir16@gmail.com",
    "domain": "Artificial Intelligence",
    "start_date": "2025-07-09",
    "end_date": "2025-07-31",
    "tasks_performed": "3",
    "date_time": "2025-07-13T08:13:26.720Z"
  }
}`}
                className="font-mono text-sm"
                rows={12}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Response</h3>
              <Textarea
                readOnly
                value={`{
  "success": true,
  "submissionId": "38afcad3-f5d0-477d-b4e2-6a351912509d",
  "candidateName": "Himanshu Jangir",
  "domain": "Artificial Intelligence",
  "certificateUrl": "http://localhost:3000/api/download-certificate/38afcad3-f5d0-477d-b4e2-6a351912509d",
  "viewUrl": "http://localhost:3000/api/view-certificate/38afcad3-f5d0-477d-b4e2-6a351912509d"
}`}
                className="font-mono text-sm"
                rows={10}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📁 Additional Images Setup</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>For a complete certificate design, add these optional images:</p>
                <p>
                  • <code>public/images/msme-logo.png</code> - MSME certification logo
                </p>
                <p>
                  • <code>public/images/gov-india-logo.png</code> - Government of India emblem
                </p>
                <p>
                  • <code>public/images/iso-logo.png</code> - ISO certification badge
                </p>
                <p className="mt-2 font-medium">Required images (already configured):</p>
                <p>
                  • <code>public/images/logo.png</code> - Company logo
                </p>
                <p>
                  • <code>public/images/signature.png</code> - Founder signature
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
