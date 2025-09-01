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
  FileText,
  Download,
  Eye,
  ExternalLink,
  Search,
  Filter,
  Users,
  Calendar,
  RefreshCw,
  CheckCircle,
  Award,
  Mail,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"

interface OfferLetter {
  id: string
  submissionId: string
  candidateName: string
  email: string
  domain: string
  college: string | null
  academicQualification: string | null
  currentSemester: string | null
  approved: boolean
  createdAt: string
}

interface OfferLetterDetails {
  id: string
  submissionId: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  domain: string
  startDate: string
  endDate: string
  college: string | null
  academicQualification: string | null
  currentSemester: string | null
  learnAboutUs: string | null
  gender: string | null
  joinedLinkedin: string | null
  resume: string | null
  signature: string | null
  cloudinaryUrl: string
  submissionDateTime: string
  createdAt: string
  candidateName: string
}

export default function OfferLettersDashboard() {
  const [offerLetters, setOfferLetters] = useState<OfferLetter[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [domain, setDomain] = useState("All domains")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pagination, setPagination] = useState<any>({})
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedOfferLetter, setSelectedOfferLetter] = useState<OfferLetterDetails | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogLoading, setDialogLoading] = useState(false)

  const fetchOfferLetters = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(domain !== "All domains" && { domain }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        approved: activeTab === "approved" ? "true" : "false",
      })

      const response = await fetch(`/api/offer-letter/list-offer-letters?${params}`)
      const data = await response.json()

      if (data.success) {
        setOfferLetters(data.offerLetters)
        setPagination(data.pagination)
      } else {
        toast.error("Failed to fetch offer letters")
      }
    } catch (error) {
      console.error("Error fetching offer letters:", error)
      toast.error("Failed to fetch offer letters")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const response = await fetch(`/api/offer-letter/approve/${submissionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await response.json()

      if (data.success) {
        fetchOfferLetters()
      } else {
        toast.error(data.message || "Failed to approve offer letter")
      }
    } catch (error) {
      toast.error("Failed to approve offer letter")
    }
  }

  const fetchOfferLetterDetails = async (submissionId: string, openDialog: boolean = true) => {
    setDialogLoading(true)
    try {
      const response = await fetch(`/api/offer-letter/get-offer-letter-details/${submissionId}`)
      const data = await response.json()

      if (data.success) {
        setSelectedOfferLetter(data.offerLetter)
        if (openDialog) {
          setDialogOpen(true)
        }
        return data.offerLetter
      } else {
        throw new Error("Failed to fetch offer letter details")
      }
    } catch (error) {
      console.error("Error fetching offer letter details:", error)
      toast.error("Failed to fetch offer letter details")
      throw error
    } finally {
      setDialogLoading(false)
    }
  }

  const handleSendEmail = async (offerLetter: OfferLetterDetails) => {
    const formattedStartDate = new Date(offerLetter.startDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    const formattedEndDate = new Date(offerLetter.endDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })

    const downloadUrl = `https://ims.jamunafoundation.com/api/offer-letter/download-offer-letter/${offerLetter.submissionId}`

    const taskLinksByDomain: Record<string, string> = {
      "Web Development": "https://drive.google.com/file/d/1qHVRN5WSVr8wtBcGcm7WRWDtq7aDpaUW/view?usp=sharing",
      "Android App Development": "https://drive.google.com/file/d/12yIhG_iDnKNQ8eBuwx-q1G6R6hU20F-5/view?usp=drive_link",
      "Data Science": "https://drive.google.com/file/d/1t2yWQYlSLniWS4Xcc_m50gaP36PjN5ip/view?usp=drive_link",
      "UI/UX Design": "https://drive.google.com/file/d/1DN8cfbh1Q-mooFmwpa5L74_eX-vf18rp/view?usp=drive_link",
      "Machine Learning": "https://drive.google.com/file/d/1VMtWpsRez0a8PvGqNq696HIwtD6ZNXci/view?usp=drive_link",
      "Python Programming": "https://drive.google.com/file/d/1wbrWmrAvl1tkbVyVUQnX06F3Sb_seAoq/view?usp=sharing",
      "C++ Programming": "https://drive.google.com/file/d/1U3BsUNMI94lp8Ceg8mSmSVqzvUy4ctGj/view?usp=sharing",
    }

    const fallbackTaskLink = "https://drive.google.com/drive/folders/1h4SHZvmquQKFmHlt4M5jdjQ6vJ5POSDN?usp=sharing"

    const normalizedDomain = offerLetter.domain.trim().toLowerCase()
    const taskLink = Object.entries(taskLinksByDomain).find(([key]) => key.toLowerCase() === normalizedDomain)?.[1] || fallbackTaskLink 
    try {
      const response = await fetch("/api/offer-letter/send-offer-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: offerLetter.id,
          candidateName: offerLetter.candidateName,
          downloadUrl: downloadUrl,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          taskLink: taskLink,
          email: offerLetter.email,
          domain: offerLetter.domain,
        }),
      })

      const data = await response.json()

      if (data.sent) {
        toast.success("Internship confirmation email sent successfully")
      } else {
        throw new Error(data.error || "Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      throw error
    }
  }

  useEffect(() => {
    fetchOfferLetters()
  }, [page, search, domain, startDate, endDate, activeTab])

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleDomainFilter = (value: string) => {
    setDomain(value)
    setPage(1)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    setPage(1)
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
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
                    <SelectItem value="Android App Development">Android App Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Python Programming">Python Programming</SelectItem>
                    <SelectItem value="C++ Programming">C++ Programming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-100">
            <TabsTrigger value="pending" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800">
              Pending Approval
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-800">
              Approved
            </TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-6">
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
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No pending offer letters found</p>
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
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200"
                        >
                          {letter.domain}
                        </Badge>
                        {letter.approved && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approved
                          </Badge>
                        )}
                      </div>
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
                      {!letter.approved && activeTab === "pending" && (
                        <Button
                          onClick={() => 
                            toast.promise(handleApprove(letter.submissionId), {
                              loading: 'Approving offer letter...',
                              success: () => {
                                return 'Offer letter approved successfully';
                              },
                              error: 'Failed to approve offer letter',
                            })
                          }
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                      )}
                      <Button
                        asChild
                        variant={activeTab === "approved" ? "default" : "outline"}
                        className={activeTab === "approved" ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" : "border-2 hover:bg-green-50 hover:border-green-300 bg-transparent"}
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
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
                            onClick={() => fetchOfferLetterDetails(letter.submissionId)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] bg-white/90 backdrop-blur-sm">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                              Offer Letters Details
                            </DialogTitle>
                          </DialogHeader>
                          {dialogLoading ? (
                            <div className="text-center py-8">
                              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                              <p className="text-gray-600 mt-4">Loading details...</p>
                            </div>
                          ) : selectedOfferLetter ? (
                            <div>
                              <div className="grid gap-6 md:grid-cols-2 mt-6">
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Submission ID</p>
                                    <p className="text-gray-900">{selectedOfferLetter.submissionId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Email</p>
                                    <p className="text-gray-900">{selectedOfferLetter.email || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Phone Number</p>
                                    <p className="text-gray-900">{selectedOfferLetter.phoneNumber || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Domain</p>
                                    <p className="text-gray-900">{selectedOfferLetter.domain}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Start Date</p>
                                    <p className="text-gray-900">{new Date(selectedOfferLetter.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">End Date</p>
                                    <p className="text-gray-900">{new Date(selectedOfferLetter.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Resume</p>
                                    {selectedOfferLetter.resume ? (
                                      <a
                                        href={selectedOfferLetter.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                      >
                                        View Resume
                                      </a>
                                    ) : (
                                      <p className="text-gray-900">None</p>
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">College</p>
                                    <p className="text-gray-900">{selectedOfferLetter.college || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Academic Qualification</p>
                                    <p className="text-gray-900">{selectedOfferLetter.academicQualification || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Current Semester</p>
                                    <p className="text-gray-900">{selectedOfferLetter.currentSemester || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Learn About Us</p>
                                    <p className="text-gray-900">{selectedOfferLetter.learnAboutUs || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Gender</p>
                                    <p className="text-gray-900">{selectedOfferLetter.gender || "N/A"}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-700">Joined LinkedIn</p>
                                    <p className="text-gray-900">{selectedOfferLetter.joinedLinkedin || "N/A"}</p>
                                  </div>
                                </div>
                              </div>                              
                            </div>
                          ) : (
                            <p className="text-gray-600">No details available</p>
                          )}
                        </DialogContent>
                      </Dialog>
                      {letter.approved && (
                        <Button
                          onClick={() => 
                            toast.promise(
                              fetchOfferLetterDetails(letter.submissionId, false).then((offerLetter) => 
                                offerLetter && handleSendEmail(offerLetter)
                              ), {
                                loading: 'Sending email...',
                                success: () => 'Email sent successfully',
                                error: 'Failed to send email',
                              })
                          }
                          className="border-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
                          variant="outline"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                      )}
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