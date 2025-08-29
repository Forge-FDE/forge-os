import { Badge } from "@/components/ui/badge"

interface IngestionSource {
  id: string
  accountName: string
  spreadsheetId: string
  active: boolean
  lastRunAt: Date | null
  lastStatus: string | null
}

export function IngestionSourcesList({ sources }: { sources: IngestionSource[] }) {
  if (sources.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No sources configured. Add Google Sheet IDs to environment variables.
      </p>
    )
  }
  
  return (
    <div className="space-y-2">
      {sources.map((source) => (
        <div key={source.id} className="flex items-center justify-between text-sm">
          <span className="truncate">{source.spreadsheetId.slice(0, 20)}...</span>
          <Badge variant={source.lastStatus === 'success' ? 'default' : 'destructive'}>
            {source.lastStatus || 'never run'}
          </Badge>
        </div>
      ))}
    </div>
  )
}
