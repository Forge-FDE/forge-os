import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPICard } from "@/components/ui/kpi-card"
import { Progress } from "@/components/ui/progress"

interface AccountOverviewProps {
  account: {
    volume7d: number
    revenue7d: number
    cost7d: number
    gm7d: number
    qcPct7d: number
    aht7d: number
    p95ms7d: number
    automation7d: number
    notes: string | null
  }
}

export function AccountOverview({ account }: AccountOverviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Weekly Volume"
          value={account.volume7d.toLocaleString()}
          description="Last 7 days"
        />
        <KPICard
          title="Revenue"
          value={formatCurrency(account.revenue7d)}
          description="Last 7 days"
        />
        <KPICard
          title="Gross Margin"
          value={`${(account.gm7d * 100).toFixed(1)}%`}
          description="Revenue - Cost"
          deltaType={account.gm7d > 0.3 ? "positive" : "negative"}
        />
        <KPICard
          title="Quality"
          value={`${(account.qcPct7d * 100).toFixed(1)}%`}
          description="QC Pass Rate"
          deltaType={account.qcPct7d >= 0.99 ? "positive" : "negative"}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>AHT</span>
                <span>{account.aht7d.toFixed(0)}s</span>
              </div>
              <Progress value={Math.min((300 - account.aht7d) / 3, 100)} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>P95 Latency</span>
                <span>{account.p95ms7d}ms</span>
              </div>
              <Progress value={Math.min((1000 - account.p95ms7d) / 10, 100)} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Automation</span>
                <span>{(account.automation7d * 100).toFixed(0)}%</span>
              </div>
              <Progress value={account.automation7d * 100} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {account.notes || "No notes available"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
