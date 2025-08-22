"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Award,
  Download,
  Eye,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Heart,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"

interface Certificate {
  id: string
  submissionId: string
  candidateName: string
  email: string
  domain: string
  startDate: string
  endDate: string
  tasksPerformed: number
  linkedinLinksCount: number
  githubLinksCount: number
  hasHostedWebsite: boolean
  hasExperienceLink: boolean
  hasDonation: boolean
  approved: boolean
  createdAt: string
}

function formatDateWithOffset(dateStr: string, daysToAdd: number): string {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + daysToAdd)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function CertificatesDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [domain, setDomain] = useState("All domains")
  const [pagination, setPagination] = useState<any>({})
  const [activeTab, setActiveTab] = useState("pending")

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(domain !== "All domains" && { domain }),
        approved: activeTab === "approved" ? "true" : "false",
      })

      const response = await fetch(`/api/certificate/list-certificates?${params}`)
      const data = await response.json()

      if (data.success) {
        setCertificates(data.certificates)
        setPagination(data.pagination)
      } else {
        toast("Error", {
          description: data.message || "Failed to fetch certificates",
        })
      }
    } catch (error) {
      console.error("Error fetching certificates:", error)
      toast("Error", {
        description: "Failed to fetch certificates",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/certificate/approve/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()

      if (data.success) {
        toast("Success", {
          description: "Certificate approved successfully",
        })
        fetchCertificates() // Refresh the list
      } else {
        toast("Error", {
          description: data.message || "Failed to approve certificate",
        })
      }
    } catch (error) {
      toast("Error", {
        description: "Failed to approve certificate",
      })
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [page, search, domain, activeTab])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDomainFilter = (value: string) => {
    setDomain(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Certificates Dashboard</h1>
                <p className="text-xl text-purple-100 mt-2">Manage and track all generated certificates</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-purple-100">
              <div className="text-center">
                <div className="text-2xl font-bold">{pagination.total || 0}</div>
                <div className="text-sm">Total Certificates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{certificates.length}</div>
                <div className="text-sm">This Page</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 max-w-7xl -mt-8">
        {/* Filters Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Filter className="w-5 h-5 text-gray-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Search & Filter</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold text-gray-700">
                  Search
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or ID..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 h-11 border-2 border-gray-200 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-semibold text-gray-700">
                  Domain
                </Label>
                <Select value={domain} onValueChange={handleDomainFilter}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-purple-500">
                    <SelectValue placeholder="All domains" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All domains">All domains</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={fetchCertificates}
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Pending/Approved */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
            <TabsTrigger value="pending" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              Pending Approval
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
              Approved
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-gray-600 text-lg">Loading certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No pending certificates found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              ) : (
                certificates.map((cert, index) => (
                  <Card
                    key={cert.id}
                    className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {cert.candidateName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.candidateName}</h3>
                            <p className="text-gray-600 mb-1">{cert.email}</p>
                            <p className="text-sm text-gray-500">ID: {cert.submissionId}</p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
                        >
                          {cert.domain}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">{cert.tasksPerformed} Tasks</p>
                            <p className="text-xs text-blue-600">Completed</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">{cert.linkedinLinksCount} LinkedIn</p>
                            <p className="text-xs text-blue-600">Links</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Github className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cert.githubLinksCount} GitHub</p>
                            <p className="text-xs text-gray-600">Repos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Globe className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-900">Website</p>
                            <p className="text-xs text-green-600">{cert.hasHostedWebsite ? "Available" : "None"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {cert.hasExperienceLink && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Experience
                          </Badge>
                        )}
                        {cert.hasDonation && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <Heart className="w-3 h-3 mr-1" />
                            Donated
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleApprove(cert.submissionId)}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-2 hover:bg-green-50 hover:border-green-300 bg-transparent"
                        >
                          <a
                            href={`/api/certificate/download-certificate/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                        >
                          <a
                            href={`/api/certificate/view-certificate/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                        >
                          <a
                            href={`/api/certificate/get-certificate-details/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Details
                          </a>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(cert.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Issued: {formatDateWithOffset(cert.endDate, 3)}
                        </div>
                        <div className="text-xs text-gray-400">#{index + 1 + (page - 1) * 10}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="approved">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                  </div>
                  <p className="text-gray-600 text-lg">Loading certificates...</p>
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No approved certificates found</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
                </div>
              ) : (
                certificates.map((cert, index) => (
                  <Card
                    key={cert.id}
                    className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {cert.candidateName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.candidateName}</h3>
                            <p className="text-gray-600 mb-1">{cert.email}</p>
                            <p className="text-sm text-gray-500">ID: {cert.submissionId}</p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
                        >
                          {cert.domain}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">{cert.tasksPerformed} Tasks</p>
                            <p className="text-xs text-blue-600">Completed</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Linkedin className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-900">{cert.linkedinLinksCount} LinkedIn</p>
                            <p className="text-xs text-blue-600">Links</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="p-2 bg-gray-100 rounded-full">
                            <Github className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cert.githubLinksCount} GitHub</p>
                            <p className="text-xs text-gray-600">Repos</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="p-2 bg-green-100 rounded-full">
                            <Globe className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-900">Website</p>
                            <p className="text-xs text-green-600">{cert.hasHostedWebsite ? "Available" : "None"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        {cert.hasExperienceLink && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Experience
                          </Badge>
                        )}
                        {cert.hasDonation && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <Heart className="w-3 h-3 mr-1" />
                            Donated
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          asChild
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <a
                            href={`/api/certificate/download-certificate/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                        >
                          <a
                            href={`/api/certificate/view-certificate/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                        >
                          <a
                            href={`/api/certificate/get-certificate-details/${cert.submissionId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Details
                          </a>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          Created:{" "}
                          {new Date(cert.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          Issued: {formatDateWithOffset(cert.endDate, 3)}
                        </div>
                        <div className="text-xs text-gray-400">#{index + 1 + (page - 1) * 10}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card className="mt-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={!pagination.hasPrev}
                    className="border-2"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center px-4 py-2 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={!pagination.hasNext}
                    className="border-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}