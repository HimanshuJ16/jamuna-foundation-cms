"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Shield, CheckCircle, ExternalLink } from "lucide-react"

interface QRCodeInfoProps {
  submissionId?: string
}

export function QRCodeInfo({ submissionId }: QRCodeInfoProps) {
  const verificationUrl = submissionId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/verify-certificate/${submissionId}`
    : "https://ims.jamunafoundation.com/verify-certificate/[ID]"

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-emerald-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <QrCode className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-green-900">QR Code Verification</CardTitle>
            <CardDescription className="text-green-700">How the QR code verification system works</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">1. Scan QR Code</h3>
            <p className="text-sm text-gray-600">
              Each certificate contains a unique QR code that links to a verification page
            </p>
          </div>

          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">2. Verify Authenticity</h3>
            <p className="text-sm text-gray-600">Our system checks the certificate against our secure database</p>
          </div>

          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">3. View Details</h3>
            <p className="text-sm text-gray-600">See complete certificate information and candidate achievements</p>
          </div>
        </div>

        <div className="p-4 bg-white/60 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Verification URL Format:</h4>
          <code className="text-sm bg-gray-100 px-3 py-2 rounded block text-gray-800 break-all">{verificationUrl}</code>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900">Security Features:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Unique certificate IDs prevent duplication
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Real-time database verification
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Tamper-proof QR code generation
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Detailed candidate information display
            </li>
          </ul>
        </div>

        {submissionId && (
          <div className="pt-4 border-t">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <a href={verificationUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Verification Page
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
