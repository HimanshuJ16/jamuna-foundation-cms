"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, FileText, Award, LayoutDashboard, Users, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from 'next/image';

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
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-text.png"
              alt="Jamuna Foundation"
              width={180}
              height={128}
              className="rounded-full"
            />
          </Link>        

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  )}
                >
                  <Link href={item.href}>
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden lg:inline">{item.title}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg"></span>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  const isActive = pathname === item.href

                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "justify-start gap-3 px-4 py-3 text-left font-medium",
                        isActive
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Link href={item.href}>
                        <IconComponent className="w-5 h-5" />
                        {item.title}
                      </Link>
                    </Button>
                  )
                })}
              </div>

              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-500 text-center">© 2024 Jamuna Foundation</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
