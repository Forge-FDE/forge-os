"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusChip } from "@/components/ui/status-chip"
import { EscalationBadge } from "@/components/ui/escalation-badge"
import { PhaseIndicator } from "@/components/ui/phase-indicator"
import { Sparkline } from "@/components/charts/sparkline"
import { ExternalLink } from "lucide-react"
import { Phase } from "@prisma/client"

interface AccountsTableProps {
  accounts: Array<{
    id: string
    name: string
    codename: string | null
    phase: Phase
    sto: {
      id: string
      name: string | null
      email: string
      role: string
      createdAt: Date
      emailVerified: Date | null
      image: string | null
    }
    sentiment: string | null
    escalationState: string
    escalationScore: number
    volume7d: number
    revenue7d: number
    qcPct7d: number
    automation7d: number
    blockersOpen: number
    dsltDays: number
    actions: Array<{ status: string; severity?: string }>
  }>
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No accounts found</CardTitle>
          <CardDescription>
            Try adjusting your filters or run data ingestion
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>STO</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Volume (7d)</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">QC%</TableHead>
              <TableHead className="text-right">Auto%</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{account.name}</div>
                    {account.codename && (
                      <div className="text-xs text-muted-foreground">{account.codename}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <PhaseIndicator phase={account.phase} showLabel={false} />
                </TableCell>
                <TableCell>{account.sto?.name || account.sto?.email?.split('@')[0] || 'Unknown'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <StatusChip sentiment={account.sentiment} size="sm" />
                    {(account.dsltDays || 0) > 2 && (
                      <Badge variant="outline" className="text-xs">
                        {account.dsltDays || 0}d DSLT
                      </Badge>
                    )}
                    {(account.blockersOpen || 0) > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {account.blockersOpen || 0} blocker{(account.blockersOpen || 0) > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <EscalationBadge state={account.escalationState || 'none'} showIcon={false} />
                </TableCell>
                <TableCell className="text-right">{(account.volume7d || 0).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  {(account.revenue7d || 0) > 0 ? `$${((account.revenue7d || 0) / 1000).toFixed(1)}k` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <span className={(account.qcPct7d || 0) >= 0.99 ? "text-green-600" : "text-amber-600"}>
                    {((account.qcPct7d || 0) * 100).toFixed(1)}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={(account.automation7d || 0) >= 0.3 ? "text-green-600" : ""}>
                    {((account.automation7d || 0) * 100).toFixed(0)}%
                  </span>
                </TableCell>
                <TableCell className="w-24">
                  <div className="text-xs text-muted-foreground">
                    Chart
                  </div>
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/accounts/${account.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
