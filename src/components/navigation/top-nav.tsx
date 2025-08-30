"use client"

interface TopNavProps {
  user: {
    email: string
    name?: string | null
    role: string
  }
}

export function TopNav({ user }: TopNavProps) {
  return (
    <header 
      style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h1 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: '#111827',
          margin: '0'
        }}>
          Dashboard
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '14px', textAlign: 'right' }}>
          <div style={{ fontWeight: '500', color: '#111827' }}>
            {user.name || 'User'}
          </div>
          <div style={{ color: '#6b7280', fontSize: '12px' }}>
            {user.email}
          </div>
        </div>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '500',
            color: '#374151'
          }}
        >
          {user.name?.[0] || user.email[0].toUpperCase()}
        </div>
      </div>
    </header>
  )
}
