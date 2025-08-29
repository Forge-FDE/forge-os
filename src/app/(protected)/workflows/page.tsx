import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
        <p className="text-muted-foreground">
          Track workflow progress and ownership
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow List</CardTitle>
          <CardDescription>
            All workflows across accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No workflows found. Workflows will appear here after data ingestion.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
