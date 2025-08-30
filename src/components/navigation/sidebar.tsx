"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Building2, 
  GitBranch, 
  CircleAlert,
  Trophy,
  Settings,
  User
} from "lucide-react"

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
    <div 
      className="fixed left-0 top-0 h-full w-64 flex flex-col bg-gray-900 text-white z-10"
      style={{ 
        width: '256px', 
        minWidth: '256px',
        backgroundColor: '#1f2937',
        color: 'white'
      }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-700" style={{ borderBottom: '1px solid #374151' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500">
            <span className="text-white font-bold">🔥</span>
          </div>
          <span className="text-xl font-bold text-white">FORGE</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" style={{ flex: '1' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#374151' : 'transparent',
                  color: isActive ? '#ffffff' : '#9ca3af',
                }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* User */}
      <div 
        className="border-t p-4" 
        style={{ 
          borderTop: '1px solid #374151',
          padding: '16px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <User style={{ width: '16px', height: '16px' }} />
          </div>
          <div style={{ fontSize: '14px' }}>
            <div style={{ color: 'white' }}>User</div>
            <div style={{ color: '#9ca3af', fontSize: '12px' }}>user@forge.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}
