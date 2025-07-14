"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Eye, ExternalLink } from "lucide-react"
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="w-8 h-8" />
            Offer Letters Dashboard
          </h1>
          <p className="text-muted-foreground">View and manage all generated offer letters</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or ID..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Select value={domain} onValueChange={handleDomainFilter}>
                  <SelectTrigger>
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
                <Button onClick={fetchOfferLetters} className="w-full">
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offer Letters List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading offer letters...</div>
          ) : offerLetters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No offer letters found</div>
          ) : (
            offerLetters.map((letter) => (
              <Card key={letter.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{letter.candidateName}</h3>
                      <p className="text-sm text-muted-foreground">{letter.email}</p>
                      <p className="text-sm text-muted-foreground">ID: {letter.submissionId}</p>
                    </div>
                    <Badge variant="secondary">{letter.domain}</Badge>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 mb-4 text-sm">
                    {letter.college && <p>🎓 College: {letter.college}</p>}
                    {letter.academicQualification && <p>🎓 Qualification: {letter.academicQualification}</p>}
                    {letter.currentSemester && <p>📘 Semester: {letter.currentSemester}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm">
                      <a
                        href={`/api/offer-letter/download-offer-letter/${letter.submissionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={`/api/offer-letter/view-offer-letter/${letter.submissionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
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

                  <div className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(letter.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button variant="outline" onClick={() => setPage(page - 1)} disabled={!pagination.hasPrev}>
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!pagination.hasNext}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
