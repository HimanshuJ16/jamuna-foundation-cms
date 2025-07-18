"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, ExternalLink, Search, Filter, Users, Calendar, RefreshCw } from "lucide-react"
import { Navbar } from "@/components/Navbar"

interface OfferLetter {
  id: string
  submissionId: string
  candidateName: string
  email: string
  domain: string
  college: string | null
  academicQualification: string | null
  currentSemester: string | null
  createdAt: string
}

export default function OfferLettersDashboard() {
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [domain, setDomain] = useState("All domains")
  const [pagination, setPagination] = useState<any>({})

  const fetchOfferLetters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(domain !== "All domains" && { domain }),
      })

      const response = await fetch(`/api/offer-letter/list-offer-letters?${params}`)
      const data = await response.json()

      if (data.success) {
        setOfferLetters(data.offerLetters)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching offer letters:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOfferLetters()
  }, [page, search, domain])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDomainFilter = (value: string) => {
    setDomain(value)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Offer Letters Dashboard</h1>
                <p className="text-xl text-blue-100 mt-2">Manage and track all generated offer letters</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-blue-100">
              <div className="text-center">
                <div className="text-2xl font-bold">{pagination.total || 0}</div>
                <div className="text-sm">Total Letters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{offerLetters.length}</div>
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
                    className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain" className="text-sm font-semibold text-gray-700">
                  Domain
                </Label>
                <Select value={domain} onValueChange={handleDomainFilter}>
                  <SelectTrigger className="h-11 border-2 border-gray-200 focus:border-blue-500">
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
                  onClick={fetchOfferLetters}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer Letters List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <p className="text-gray-600 text-lg">Loading offer letters...</p>
            </div>
          ) : offerLetters.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No offer letters found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            offerLetters.map((letter, index) => (
              <Card
                key={letter.id}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {letter.candidateName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{letter.candidateName}</h3>
                        <p className="text-gray-600 mb-1">{letter.email}</p>
                        <p className="text-sm text-gray-500">ID: {letter.submissionId}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200"
                    >
                      {letter.domain}
                    </Badge>
                  </div>

                  {(letter.college || letter.academicQualification || letter.currentSemester) && (
                    <div className="grid gap-3 md:grid-cols-3 mb-6 p-4 bg-gray-50 rounded-lg">
                      {letter.college && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{letter.college}</span>
                        </div>
                      )}
                      {letter.academicQualification && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{letter.academicQualification}</span>
                        </div>
                      )}
                      {letter.currentSemester && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Semester {letter.currentSemester}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      <a
                        href={`/api/offer-letter/download-offer-letter/${letter.submissionId}`}
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
                      className="border-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                    >
                      <a
                        href={`/api/offer-letter/view-offer-letter/${letter.submissionId}`}
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
                      className="border-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                    >
                      <a
                        href={`/api/offer-letter/get-offer-letter-details/${letter.submissionId}`}
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
                      {new Date(letter.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-gray-400">#{index + 1 + (page - 1) * 10}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
                  <div className="flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">
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
