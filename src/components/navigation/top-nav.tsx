"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopNavProps {
  user: {
    email: string
    name?: string | null
    role: string
  }
}

export function TopNav({ user }: TopNavProps) {
  const pathname = usePathname()
  
  const breadcrumbs = [
    { name: "Dashboard", href: "/" },
    { name: "Accounts", href: "/accounts" },
    { name: "Workflows", href: "/workflows" },
    { name: "Actions", href: "/actions" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Admin", href: "/admin" },
  ]
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <nav className="flex space-x-8">
          {breadcrumbs.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href
                  ? "text-gray-900 border-b-2 border-orange-500 pb-1"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name?.[0] || user.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
