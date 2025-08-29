import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground">
          Manage and monitor all customer accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account List</CardTitle>
          <CardDescription>
            All accounts in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No accounts found. Accounts will appear here after data ingestion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
