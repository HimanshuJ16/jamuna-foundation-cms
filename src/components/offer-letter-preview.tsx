"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, RefreshCw } from "lucide-react"

interface PDFPreviewProps {
  formData: {
    id: string
    first_name: string
    last_name: string
    domain: string
    date_time: string
  }
  isFormValid: boolean
}

export function PDFPreview({ formData, isFormValid }: PDFPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  const generatePreview = async () => {
    if (!isFormValid) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/offer-letter/preview-offer-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate preview")
      }

      // Create blob URL for the PDF
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      // Clean up previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setPreviewUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate preview")
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate preview when form data changes (with debounce)
  useEffect(() => {
    if (!isFormValid) {
      setPreviewUrl("")
      return
    }

    const timeoutId = setTimeout(() => {
      generatePreview()
    }, 1000) // 1 second debounce

    return () => clearTimeout(timeoutId)
  }, [formData, isFormValid])

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Live PDF Preview
            </CardTitle>
            <CardDescription>See how your offer letter will look</CardDescription>
          </div>
          <Button onClick={generatePreview} disabled={loading || !isFormValid} size="sm" variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Generating..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>
        )}

        {!isFormValid && !error && (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Fill the form to see preview</p>
              <p className="text-sm">Enter all required fields to generate a live preview</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
              <p className="text-gray-600">Generating preview...</p>
            </div>
          </div>
        )}

        {previewUrl && !loading && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-800 text-sm font-medium">✅ Preview ready!</p>
              <p className="text-green-700 text-xs">This is how your PDF will look when generated</p>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <iframe src={previewUrl} className="w-full h-96" title="PDF Preview" style={{ border: "none" }} />
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-4 h-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
              <Button onClick={generatePreview} size="sm" variant="outline" className="flex-1 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
