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
          flexDirection: 'column'
        }}
      >
        <TopNav user={session.user} />
        <main 
          style={{ 
            flex: '1',
            backgroundColor: '#f9fafb',
            overflow: 'auto'
          }}
        >
          <div 
            style={{ 
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '32px 24px'
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
