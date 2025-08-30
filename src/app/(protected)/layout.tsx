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
    <div className="flex h-screen w-screen bg-gray-50" style={{ minHeight: '100vh' }}>
      {/* Force cache refresh v2 */}
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopNav user={session.user} />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
