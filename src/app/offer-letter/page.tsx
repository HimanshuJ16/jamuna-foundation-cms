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
import { PDFPreview } from "@/components/offer-letter-preview"

export default function Component() {
  const [formData, setFormData] = useState({
    id: "",
    first_name: "",
    last_name: "",
    domain: "",
    date_time: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  // Check if form is valid for preview
  const isFormValid = useMemo(() => {
    return !!(formData.id && formData.first_name && formData.last_name && formData.domain)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/offer-letter/generate-offer-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setResponse(data)
        toast("Success!", {
          description: "Offer letter generated successfully",
        })
      } else {
        throw new Error(data.error || "Failed to generate offer letter")
      }
    } catch (error) {
        toast("Error", {
          description: error instanceof Error ? error.message : "Failed to generate offer letter",
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
          Offer Letter Generator
        </h1>
        <p className="text-muted-foreground">Generate internship offer letters</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Form and Response */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Internship Offer Letter</CardTitle>
              <CardDescription>Fill out the form to generate a personalized internship offer letter</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Submission ID</Label>
                  <Input
                    id="id"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
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
                  <Label htmlFor="domain">Preferred Internship Domain</Label>
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
                      <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                      <SelectItem value="Android App Development">Android App Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating..." : "Generate Offer Letter"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* API Response Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Response</CardTitle>
              <CardDescription>The generated offer letter details will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {response ? (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2">Success!</h3>
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
                            <a href={response.offerLetterUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                            <a href={response.viewUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-2" />
                              View PDF
                            </a>
                          </Button>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>
                            <strong>Download URL:</strong> {response.offerLetterUrl}
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
        <PDFPreview formData={formData} isFormValid={isFormValid} />
      </div>

      {/* API Documentation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Main Endpoint</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/offer-letter/generate-offer-letter</code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Preview Endpoint</h3>
              <code className="bg-gray-100 px-2 py-1 rounded">POST /api/offer-letter/preview-offer-letter</code>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Request Body</h3>
              <Textarea
                readOnly
                value={`{
  "id": "submission_123",
  "first_name": "John",
  "last_name": "Doe", 
  "domain": "Web Development",
  "date_time": "2024-01-15T10:30:00Z"
}`}
                className="font-mono text-sm"
                rows={8}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Response</h3>
              <Textarea
                readOnly
                value={`{
  "success": true,
  "submissionId": "submission_123",
  "candidateName": "John Doe",
  "domain": "Web Development", 
  "offerLetterUrl": "http://localhost:3000/api/offer-letter/download-offer-letter/submission_123",
  "viewUrl": "http://localhost:3000/api/offer-letter/view-offer-letter/submission_123"
}`}
                className="font-mono text-sm"
                rows={10}
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📁 Image Setup Instructions</h3>
              <div className="text-blue-700 text-sm space-y-1">
                <p>
                  1. Add your company logo: <code>public/images/logo.png</code>
                </p>
                <p>
                  2. Add founder signature: <code>public/images/signature.png</code>
                </p>
                <p>3. Recommended logo size: 120x60px (2:1 ratio)</p>
                <p>4. Recommended signature size: 150x50px (3:1 ratio)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
