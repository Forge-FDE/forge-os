import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ActionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actions</h1>
        <p className="text-muted-foreground">
          Track and manage all open actions and blockers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Actions</CardTitle>
          <CardDescription>
            Actions requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No open actions. Actions will appear here after data ingestion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
