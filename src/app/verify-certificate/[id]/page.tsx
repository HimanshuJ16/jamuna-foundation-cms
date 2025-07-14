"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Award,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Building,
  Download,
  Eye,
  Shield,
  Clock,
  ExternalLink,
  Globe,
} from "lucide-react"
import Image from 'next/image'
import Link from "next/link"

interface CertificateDetails {
  id: string
  submissionId: string
  firstName: string
  lastName: string
  candidateName: string
  email: string
  domain: string
  startDate: string
  endDate: string
  tasksPerformed: number
  linkedinLinks: string[]
  githubLinks: string[]
  hostedWebsite: string | null
  experienceLink: string | null
  donation: string | null
  cloudinaryUrl: string
  submissionDateTime: string
  createdAt: string
  totalLinkedinLinks: number
  totalGithubLinks: number
}

export default function VerifyCertificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [certificate, setCertificate] = useState<CertificateDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificate/get-certificate-details/${id}`)
        const data = await response.json()

        if (data.success) {
          setCertificate(data.certificate)
          setVerified(true)
        } else {
          setError(data.error || "Certificate not found")
        }
      } catch (err) {
        setError("Failed to verify certificate")
      } finally {
        setLoading(false)
      }
    }

    fetchCertificate()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* <Navbar /> */}
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Certificate</h2>
            <p className="text-gray-600">Please wait while we verify the certificate...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-50 to-indigo-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/80 shadow-sm">
        <div className="flex h-16 items-center justify-center">
          <Image
            src="/images/logo-text.png"
            alt="Jamuna Foundation"
            width={190}
            height={48}
            className="rounded-lg"
            priority
          />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Certificate Verification</h1>
            </div>
            <p className="text-sm sm:text-lg text-blue-100 max-w-xl mx-auto">
              Verify the authenticity of Jamuna Foundation certificates
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-4xl -mt-8">
        {error ? (
          // Error State
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate Not Found</h2>
              <p className="text-gray-600 text-lg mb-6">{error}</p>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
                <p className="text-red-800 text-sm">
                  <strong>Certificate ID:</strong> {id}
                </p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : certificate ? (
          // Success State
          <div className="space-y-8">
            {/* Verification Status */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verified ✓</h2>
                  <p className="text-gray-600 text-lg mb-6">
                    This certificate is authentic and issued by Jamuna Foundation
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">Verified Certificate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Certificate Details */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-gray-900">Certificate Details</CardTitle>
                    <p className="text-gray-600">Complete information about this certificate</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {certificate.candidateName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{certificate.candidateName}</h3>
                        <p className="text-gray-600">{certificate.email}</p>
                        <Badge className="mt-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200">
                          {certificate.domain}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Internship Period</p>
                          <p className="text-gray-600">
                            {new Date(certificate.startDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(certificate.endDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Issued By</p>
                          <p className="text-gray-600">Jamuna Foundation</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">Certificate ID</p>
                          <p className="text-gray-600 font-mono">{certificate.submissionId}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-900 font-medium">Tasks Completed</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {certificate.tasksPerformed}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-900 font-medium">LinkedIn Posts</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {certificate.totalLinkedinLinks}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-blue-900 font-medium">GitHub Projects</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {certificate.totalGithubLinks}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                      <div className="space-y-3">
                        {certificate.hostedWebsite && (
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">Has hosted website</span>
                          </div>
                        )}
                        {certificate.experienceLink && (
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Experience documented</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Certificate Issued</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(certificate.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <Separator className="my-8" />
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <a
                      href={`/api/certificate/download-certificate/${certificate.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                  >
                    <a
                      href={`/api/certificate/view-certificate/${certificate.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Certificate
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Security & Authenticity</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      This certificate has been verified against our secure database. The QR code on the original
                      certificate links directly to this verification page, ensuring authenticity. Any modifications to
                      the certificate would invalidate this verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}
