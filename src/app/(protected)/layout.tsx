import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/navigation/sidebar"
import { TopNav } from "@/components/navigation/top-nav"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area - offset by sidebar width */}
      <div 
        style={{ 
          marginLeft: '256px', // Offset by sidebar width
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          top: '0'  // Ensure it starts at the top
        }}
      >
        <TopNav user={session.user} />
        <main 
          style={{ 
            flex: '1',
            backgroundColor: '#f9fafb',
            overflow: 'auto',
            position: 'relative'
          }}
        >
          <div 
            style={{ 
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '32px 24px',
              minHeight: 'calc(100vh - 64px)' // Account for top nav height
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
