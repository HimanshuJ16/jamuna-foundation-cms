"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Award, LayoutDashboard, Users, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from 'next/image';

export default function HomePage() {
  const navigationCards = [
    {
      title: "Generate Offer Letter",
      description: "Create personalized internship offer letters for candidates",
      icon: FileText,
      href: "/offer-letter",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Offer Letters Dashboard",
      description: "View and manage all generated offer letters",
      icon: LayoutDashboard,
      href: "/offer-letters-dashboard",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Generate Certificate",
      description: "Create completion certificates for internship programs",
      icon: Award,
      href: "/certificate",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Certificates Dashboard",
      description: "View and manage all generated certificates",
      icon: Users,
      href: "/certificates-dashboard",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      buttonColor: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/logo-text.png"
                alt="Jamuna Foundation"
                width={328}
                height={128}
                className="rounded-full"
              />
            </div>
          </div>

          {/* Title and Description */}
          {/* <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Jamuna Foundation</h1> */}
          {/* <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">Internship Management System</h2> */}
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your internship program management with our comprehensive platform. Generate offer letters,
            certificates, and manage all your documentation efficiently.
          </p> */}
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {navigationCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <Card
                key={index}
                className={`${card.color} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full bg-white shadow-md`}>
                      <IconComponent className={`w-8 h-8 ${card.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{card.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    asChild
                    className={`w-full ${card.buttonColor} text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group`}
                  >
                    <Link href={card.href}>
                      Access {card.title.split(" ")[card.title.split(" ").length - 1]}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">© 2024 Jamuna Foundation. All rights reserved.</p>
          <p className="text-gray-400 text-xs mt-2">Internship Management System v1.0</p>
        </div>
      </div>
    </div>
  )
}
