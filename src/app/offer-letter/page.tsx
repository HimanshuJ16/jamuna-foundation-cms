"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Download, Eye, FileText, Sparkles, CheckCircle, Clock } from "lucide-react"
import { PDFPreview } from "@/components/offer-letter-preview"
import { Navbar } from "@/components/Navbar"
import { Textarea } from "@/components/ui/textarea"

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
        toast.success("Offer letter generated successfully")
      } else {
        throw new Error(data.error || "Failed to generate offer letter")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate offer letter")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <FileText className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Offer Letter Generator</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Create professional internship offer letters with our advanced generator
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
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900">Generate Offer Letter</CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form to create a personalized internship offer letter
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="text-sm font-semibold text-gray-700">
                      Submission ID
                    </Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="Enter unique submission ID"
                      className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
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
                        className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
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
                        className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
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
                      <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500">
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

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Offer Letter
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
                      Your offer letter details and download links
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {response ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="font-bold text-green-800 text-lg">Success!</h3>
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
                          <div className="p-3 bg-white/60 rounded-lg md:col-span-2">
                            <p className="font-semibold text-gray-700">Domain</p>
                            <p className="text-gray-900">{response.domain}</p>
                          </div>
                        </div>

                        <div className="pt-4 space-y-3">
                          <div className="flex gap-3">
                            <Button
                              asChild
                              className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                              <a href={response.offerLetterUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                              </a>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="flex-1 h-11 border-2 hover:bg-gray-50 bg-transparent"
                            >
                              <a href={response.viewUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-2" />
                                View PDF
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
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">Submit the form to see the results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-6">
            <PDFPreview formData={formData} isFormValid={isFormValid} />
          </div>
        </div>

        {/* API Documentation */}
        <Card className="mt-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-900">API Documentation</CardTitle>
            <CardDescription className="text-gray-600">
              Complete API reference for offer letter generation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2 text-blue-900">Main Endpoint</h3>
                  <code className="bg-blue-100 px-3 py-2 rounded text-sm text-blue-800 block">
                    POST /api/offer-letter/generate-offer-letter
                  </code>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold mb-2 text-orange-900">Preview Endpoint</h3>
                  <code className="bg-orange-100 px-3 py-2 rounded text-sm text-orange-800 block">
                    POST /api/offer-letter/preview-offer-letter
                  </code>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3">📁 Setup Instructions</h3>
                <div className="text-amber-800 text-sm space-y-2">
                  <p>
                    • Add company logo: <code className="bg-amber-100 px-2 py-1 rounded">public/images/logo.png</code>
                  </p>
                  <p>
                    • Add signature: <code className="bg-amber-100 px-2 py-1 rounded">public/images/signature.png</code>
                  </p>
                  <p>• Logo size: 120x60px (2:1 ratio)</p>
                  <p>• Signature size: 150x50px (3:1 ratio)</p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold mb-2 text-indigo-900">Request Body (Wix Format)</h3>
                  <code className="bg-indigo-100 px-3 py-2 rounded text-sm text-indigo-800 block">
                    <Textarea
                      readOnly
                      value={`{
  "data": {
    "id": "8e0621c6-ca7d-4e61-a2c8-b714ce05fd68",
    "first_name": "Himanshu",
    "last_name": "Jangir",
    "domain": "Web Development",
    "date_time": "2025-07-14T12:41:19.357Z",
    "email": "himanshujangir16@gmail.com",
    "phone_number": "+91 99903 39096",
    "learn_about_us": "Social Media ( Instagram, LinkedIn, etc.)",
    "gender": "Male",
    "joined_linkedin": "Yes",
    "college": "DSEU",
    "academic_qualification": "BTECH",
    "current_semester": "3",
    "resume": "https://073401d7-62e3-44e3-994e-b09e7e28be79.usrfiles.com/ugd/175f89_b518aa765529415a8e036750b780c555.pdf",
    "signature": "Signed"
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
  "submissionId": "submission_123",
  "candidateName": "John Doe",
  "domain": "Web Development", 
  "offerLetterUrl": "http://localhost:3000/api/offer-letter/download-offer-letter/submission_123",
  "viewUrl": "http://localhost:3000/api/offer-letter/view-offer-letter/submission_123",
  "startDate": "01/08/2025"                                                                        
  "endDate": "31/08/2025"                                                                      
  "taskLink": "https://drive.google.com/file/d/1DN8cfbh1Q-mooFmwpa5L74_eX-vf18rp/view?usp=drive_link"
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
