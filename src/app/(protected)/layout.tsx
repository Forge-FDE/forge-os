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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f9fafb',
      display: 'flex',
      flexDirection: 'row'
    }}>
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div 
        style={{ 
          flex: '1',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9fafb'
        }}
      >
        <TopNav user={session.user} />
        <main 
          style={{ 
            flex: '1',
            backgroundColor: '#f9fafb',
            overflow: 'auto',
            padding: '32px 24px'
          }}
        >
          <div 
            style={{ 
              maxWidth: '1280px',
              margin: '0 auto',
              width: '100%'
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
