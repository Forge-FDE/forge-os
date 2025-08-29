import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const session = await auth()
  
  if (session?.user?.role !== "admin") {
    redirect("/")
  }

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
            <CardTitle>Ingestion Sources</CardTitle>
            <CardDescription>
              Manage Google Sheets data sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              No ingestion sources configured
            </p>
            <Button variant="outline" size="sm">
              Add Source
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Ingestion</CardTitle>
            <CardDescription>
              Trigger data import manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Run the data ingestion process on demand
            </p>
            <Button variant="outline" size="sm">
              Run Ingestion
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage user roles and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {session?.user?.email} (Admin)
            </p>
            <Button variant="outline" size="sm">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Database</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Auth</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Ingestion</span>
                <span>Never</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
