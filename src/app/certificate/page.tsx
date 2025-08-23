"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Download, Eye, Award, CheckCircle, Clock, Star } from "lucide-react"
import { CertificatePreview } from "@/components/certificate-preview"
import { Navbar } from "@/components/Navbar"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeInfo } from "@/components/qr-code-info"

export default function CertificatePage() {
  const [formData, setFormData] = useState({
    submission_id: "",
    first_name: "",
    last_name: "",
    email: "",
    domain: "",
    start_date: "",
    end_date: "",
    tasks_performed: "",
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
      const res = await fetch("/api/certificate/generate-certificate", {
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
        toast.success("Certificate generated successfully")
      } else {
        throw new Error(data.error || "Failed to generate certificate")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate certificate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Award className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Certificate Generator</h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Create beautiful completion certificates for internship programs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl -mt-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Form and Response */}
          <div className="space-y-6">
            {/* Form Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Star className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Generate Certificate</CardTitle>
                    <CardDescription className="text-gray-600">
                      Create a personalized internship completion certificate
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="submission_id" className="text-sm font-semibold text-gray-700">
                      Submission ID
                    </Label>
                    <Input
                      id="submission_id"
                      value={formData.submission_id}
                      onChange={(e) => setFormData({ ...formData, submission_id: e.target.value })}
                      placeholder="Enter unique submission ID"
                      className="h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        placeholder="Enter first name"
                        className="h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        placeholder="Enter last name"
                        className="h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-sm font-semibold text-gray-700">
                      Internship Domain
                    </Label>
                    <Select
                      value={formData.domain}
                      onValueChange={(value) => setFormData({ ...formData, domain: value })}
                    >
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-purple-500">
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
                      <Label htmlFor="start_date" className="text-sm font-semibold text-gray-700">
                        Start Date
                      </Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_date" className="text-sm font-semibold text-gray-700">
                        End Date
                      </Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5" />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Response Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Generation Result</CardTitle>
                    <CardDescription className="text-gray-600">
                      Your certificate details and download links
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {response ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-green-800 text-lg">Certificate Generated!</h3>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="font-semibold text-gray-700">Submission ID</p>
                            <p className="text-gray-900">{response.submissionId}</p>
                          </div>
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="font-semibold text-gray-700">Candidate</p>
                            <p className="text-gray-900">{response.candidateName}</p>
                          </div>
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="font-semibold text-gray-700">Domain</p>
                            <p className="text-gray-900">{response.domain}</p>
                          </div>
                          <div className="p-3 bg-white/60 rounded-lg">
                            <p className="font-semibold text-gray-700">Issue Date</p>
                            <p className="text-gray-900">{response.issueDate}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="font-semibold text-blue-800 mb-1">🔒 QR Code Verification</p>
                          <p className="text-blue-700 text-xs">
                            Certificate includes QR code linking to: <br />
                            <code className="bg-blue-100 px-2 py-1 rounded text-xs">
                              /verify-certificate/{response.submissionId}
                            </code>
                          </p>
                        </div>

                        <div className="pt-4 space-y-3">
                          <div className="flex gap-3">
                            <Button
                              asChild
                              className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              <a href={response.certificateUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download Certificate
                              </a>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="flex-1 h-11 border-2 hover:bg-gray-50 bg-transparent"
                            >
                              <a href={response.viewUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Certificate
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Submit the form to see the results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-6">
            <CertificatePreview formData={formData} isFormValid={isFormValid} />
          </div>
        </div>

        {/* QR Code Information */}
        <div className="mt-12">
          <QRCodeInfo submissionId={response?.submissionId} />
        </div>

        {/* API Documentation */}
        <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-900">Certificate API Documentation</CardTitle>
            <CardDescription className="text-gray-600">
              Complete API reference for certificate generation with QR verification
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold mb-2 text-purple-900">Certificate Endpoint</h3>
                  <code className="bg-purple-100 px-3 py-2 rounded text-sm text-purple-800 block">
                    POST /api/certificate/generate-certificate
                  </code>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h3 className="font-semibold mb-2 text-pink-900">Verification Endpoint</h3>
                  <code className="bg-pink-100 px-3 py-2 rounded text-sm text-pink-800 block">
                    GET /verify-certificate/[id]
                  </code>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3">📁 Setup Instructions</h3>
                <div className="text-amber-800 text-sm space-y-2">
                  <p>
                    • Certificate template:{" "}
                    <code className="bg-amber-100 px-2 py-1 rounded">public/images/certificate-template.jpg</code>
                  </p>
                  <p>
                    • Company logo: <code className="bg-amber-100 px-2 py-1 rounded">public/images/logo.png</code>
                  </p>
                  <p>
                    • Founder signature:{" "}
                    <code className="bg-amber-100 px-2 py-1 rounded">public/images/signature.png</code>
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold mb-2 text-indigo-900">Request Body (Wix Format)</h3>
                  <code className="bg-indigo-100 px-3 py-2 rounded text-sm text-indigo-800 block">
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
    "linkedin_task1": "https://eqw.com",
    "linkedin_task2": "https://eqw.com",
    "linkedin_task3": "https://eqw.com",
    "linkedin_task4": "https://eqw.com",
    "linkedin_task5": "https://eqw.com",
    "github_task1": "https://eqw.com",
    "github_task2": "https://eqw.com",
    "github_task3": "https://eqw.com",
    "github_task4": "https://eqw.com",
    "github_task5": "https://eqw.com",
    "hosted_website": "https://eqw.com",
    "experience_link": "https://eqw.com",
    "donation": "199 INR",
    "date_time": "2025-07-13T08:13:26.720Z",
    "status": "CONFIRMED",
    "order_id": "5681d22e-c217-44ab-9d70-d858d40ad03a",
    "payment_id": "pay_R5DTg4q7pBcisK"
  }
}`}
                      className="font-mono text-sm"
                      rows={12}
                    />
                  </code>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold mb-2 text-green-900">Response</h3>
                  <code className="bg-green-100 px-3 py-2 rounded text-sm text-green-800 block">
                    <Textarea
                      readOnly
                      value={`{
  "success": true,
  "submissionId": "38afcad3-f5d0-477d-b4e2-6a351912509d",
  "candidateName": "Himanshu Jangir",
  "domain": "Artificial Intelligence",
  "certificateUrl": "http://localhost:3000/api/certificate/download-certificate/38afcad3-f5d0-477d-b4e2-6a351912509d",
  "viewUrl": "http://localhost:3000/api/certificate/view-certificate/38afcad3-f5d0-477d-b4e2-6a351912509d",
  "issueDate": "2025-09-02T00:00:00.000Z"
}`}
                      className="font-mono text-sm"
                      rows={12}
                    />
                  </code>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold mb-2 text-orange-900">Request Body for Payment Verification (Wix Format)</h3>
                  <code className="bg-orange-100 px-3 py-2 rounded text-sm text-orange-800 block">
                    <Textarea
                      readOnly
                      value={`https://ims.jamunafoundation.com/api/get-submission?submissionId={submissionId}`}
                      className="font-mono text-sm"
                      rows={12}
                    />
                  </code>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-900">Response</h3>
                  <code className="bg-blue-100 px-3 py-2 rounded text-sm text-blue-800 block">
                    <Textarea
                      readOnly
                      value={`{
  "status": "CONFIRMED",
  "orderId": "5681d22e-c217-44ab-9d70-d858d40ad03a",
  "paymentId": "pay_R5DTg4q7pBcisK"
}`}
                      className="font-mono text-sm"
                      rows={12}
                    />
                  </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
