import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IngestionTrigger } from "@/components/admin/ingestion-trigger"
import { IngestionSourcesList } from "@/components/admin/ingestion-sources-list"

export default async function AdminPage() {
  const session = await auth()
  
  if (session?.user?.role !== "admin") {
    redirect("/")
  }
  
  const sources = await prisma.ingestionSource.findMany({
    orderBy: { lastRunAt: 'desc' },
  })
  
  const lastRun = sources[0]?.lastRunAt
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          System administration and configuration
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manual Ingestion</CardTitle>
            <CardDescription>
              Trigger data import manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Last run: {lastRun ? new Date(lastRun).toLocaleString() : 'Never'}
            </p>
            <IngestionTrigger />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingestion Sources</CardTitle>
            <CardDescription>
              Configured data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IngestionSourcesList sources={sources} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
