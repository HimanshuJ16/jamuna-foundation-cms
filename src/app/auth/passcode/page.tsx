"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LockKeyhole, ShieldCheck } from "lucide-react"

export default function PasscodePage() {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/verify-passcode", {
      method: "POST",
      body: JSON.stringify({ input }),
    })

    const data = await res.json()

    if (data.success) {
      toast.success("Access granted")
      router.push("/")
    } else {
      setError("Invalid passcode")
      toast.error("Access denied", { description: "Invalid passcode" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 text-white">
        <div className="container mx-auto px-6 flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Restricted Access</h1>
            <p className="text-blue-100 mt-1">Only authorized users may proceed</p>
          </div>
        </div>
      </div>

      {/* Access Form */}
      <div className="flex-grow flex items-center justify-center px-4 -mt-12">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardHeader className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
            <div className="p-2 bg-gray-100 rounded-lg">
              <LockKeyhole className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Enter Passcode</CardTitle>
              <CardDescription className="text-gray-600">
                Please verify to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  type="password"
                  placeholder="Enter secret passcode"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  required
                />
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Submit Passcode
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 mt-10 mb-6">
        © 2024 Jamuna Foundation
      </div>
    </div>
  )
}
