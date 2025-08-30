"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Building2, 
  GitBranch, 
  CircleAlert,
  Trophy,
  Settings,
  User
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Accounts", href: "/accounts", icon: Building2 },
  { name: "Workflows", href: "/workflows", icon: GitBranch },
  { name: "Actions", href: "/actions", icon: CircleAlert },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Admin", href: "/admin", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500">
            <span className="text-white font-bold">🔥</span>
          </div>
          <span className="text-xl font-bold text-white">FORGE</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      {/* User */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gray-700 text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm">
            <div className="text-white">User</div>
            <div className="text-gray-400 text-xs">user@forge.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
