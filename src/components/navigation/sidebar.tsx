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
      style={{ 
        width: '256px', 
        minWidth: '256px',
        height: '100vh',
        backgroundColor: '#1f2937',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: '0'
      }}
    >
      {/* Logo */}
      <div style={{ 
        display: 'flex', 
        height: '64px', 
        alignItems: 'center', 
        padding: '0 24px', 
        borderBottom: '1px solid #374151' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            width: '32px',
            height: '32px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px',
            backgroundColor: '#f97316'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>🔥</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>FORGE</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav style={{ 
        flex: '1', 
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#374151' : 'transparent',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#374151';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#9ca3af';
                  }
                }}
              >
                <Icon style={{ width: '20px', height: '20px', flexShrink: '0' }} />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
      
      {/* User */}
      <div 
        style={{ 
          borderTop: '1px solid #374151',
          padding: '20px 24px',
          marginTop: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#4b5563',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: '0'
            }}
          >
            <User style={{ width: '18px', height: '18px' }} />
          </div>
          <div style={{ fontSize: '14px', minWidth: '0', flex: '1' }}>
            <div style={{ 
              color: 'white', 
              fontWeight: '500', 
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              User
            </div>
            <div style={{ 
              color: '#9ca3af', 
              fontSize: '12px', 
              lineHeight: '1.2',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              user@forge.com
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
