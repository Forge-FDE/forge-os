"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopNavProps {
  user: {
    email: string
    name?: string | null
    role: string
  }
}

export function TopNav({ user }: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <div className="font-medium text-gray-900">{user.name || 'User'}</div>
            <div className="text-gray-500">{user.email}</div>
          </div>
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
