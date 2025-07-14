"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, FileText, Award, LayoutDashboard, Users, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image'

const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Generate Offer Letter",
    href: "/offer-letter",
    icon: FileText,
  },
  {
    title: "Offer Letters Dashboard",
    href: "/offer-letters-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Generate Certificate",
    href: "/certificate",
    icon: Award,
  },
  {
    title: "Certificates Dashboard",
    href: "/certificates-dashboard",
    icon: Users,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-50 to-indigo-50/95 backdrop-blur supports-[backdrop-filter]:bg-blue-50/80 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
            <Image
              src="/images/logo-text.png"
              alt="Jamuna Foundation"
              width={160}
              height={48}
              className="rounded-lg"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300",
                    isActive
                      ? "text-blue-700"
                      : "hover:text-blue-600 hover:bg-blue-100/50",
                    "relative group"
                  )}
                >
                  <Link href={item.href}>
                    <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span className="hidden lg:inline">{item.title}</span>
                    <span className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
                      isActive && "scale-x-100"
                    )} />
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-100/50 rounded-full transition-colors duration-300"
              >
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
              <div className="flex items-center justify-between mb-8 pt-4">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/images/logo-text.png"
                    alt="Jamuna Foundation"
                    width={140}
                    height={40}
                    className="rounded-lg"
                  />
                </Link>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600"
                >
                  <X className="w-6 h-6" />
                </Button> */}
              </div>

              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className={cn(
                        "justify-start gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "text-gray-700 hover:text-blue-600 hover:bg-blue-100/50",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href}>
                        <IconComponent className="w-5 h-5 transition-transform hover:scale-110" />
                        {item.title}
                      </Link>
                    </Button>
                  )
                })}
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center font-medium">
                  © 2024 Jamuna Foundation
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}