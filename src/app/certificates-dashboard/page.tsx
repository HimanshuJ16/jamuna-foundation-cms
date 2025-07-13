"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Eye, ExternalLink, Github, Linkedin, Globe, Heart } from "lucide-react"

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
  createdAt: string
}

export default function CertificatesDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [domain, setDomain] = useState("All domains")
  const [pagination, setPagination] = useState<any>({})

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(domain !== "All domains" && { domain }),
      })

      const response = await fetch(`/api/list-certificates?${params}`)
      const data = await response.json()

      if (data.success) {
        setCertificates(data.certificates)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Award className="w-8 h-8" />
          Certificates Dashboard
        </h1>
        <p className="text-muted-foreground">View and manage all generated certificates</p>
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
              <Button onClick={fetchCertificates} className="w-full">
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading certificates...</div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No certificates found</div>
        ) : (
          certificates.map((cert) => (
            <Card key={cert.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cert.candidateName}</h3>
                    <p className="text-sm text-muted-foreground">{cert.email}</p>
                    <p className="text-sm text-muted-foreground">ID: {cert.submissionId}</p>
                  </div>
                  <Badge variant="secondary">{cert.domain}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm">{cert.tasksPerformed} tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">{cert.linkedinLinksCount} LinkedIn links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <span className="text-sm">{cert.githubLinksCount} GitHub links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{cert.hasHostedWebsite ? "Has website" : "No website"}</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {cert.hasExperienceLink && (
                    <Badge variant="outline" className="text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Experience
                    </Badge>
                  )}
                  {cert.hasDonation && (
                    <Badge variant="outline" className="text-xs">
                      <Heart className="w-3 h-3 mr-1" />
                      Donated
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <a
                      href={`/api/download-certificate/${cert.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={`/api/view-certificate/${cert.submissionId}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href={`/api/get-certificate-details/${cert.submissionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Details
                    </a>
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground mt-2">
                  Created: {new Date(cert.createdAt).toLocaleDateString()}
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
  )
}
