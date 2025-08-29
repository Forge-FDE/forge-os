import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { MainNav } from "@/components/navigation/main-nav"

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
    <>
      <MainNav />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </>
  )
}
