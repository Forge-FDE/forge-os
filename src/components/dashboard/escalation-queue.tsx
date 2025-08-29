"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusChip } from "@/components/ui/status-chip"
import { EscalationBadge } from "@/components/ui/escalation-badge"
import { PhaseIndicator } from "@/components/ui/phase-indicator"
import { ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface EscalationQueueProps {
  accounts: Array<{
    id: string
    name: string
    phase: any
    sto: { name: string | null; email: string }
    dsltDays: number
    sentiment: string | null
    blockersOpen: number
    oldestBlockerAgeD: number
    nextGateDue: Date | null
    escalationScore: number
    escalationState: string
    actions: Array<{ severity: string }>
  }>
}

export function EscalationQueue({ accounts }: EscalationQueueProps) {
  const escalatedAccounts = accounts
    .filter(a => a.escalationState !== 'none')
    .sort((a, b) => b.escalationScore - a.escalationScore)
  
  const getEscalateToSuggestion = (account: typeof accounts[0]) => {
    const hasSev1 = account.actions.some(a => a.severity === 'sev-1')
    if (hasSev1) return "Founders"
    if (account.escalationScore >= 60) return "VP Sales"
    return account.sto.name || "STO Manager"
  }
  
  if (escalatedAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Escalation Queue</CardTitle>
          <CardDescription>No accounts requiring escalation</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All accounts are progressing normally.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalation Queue</CardTitle>
        <CardDescription>
          {escalatedAccounts.length} account{escalatedAccounts.length > 1 ? 's' : ''} requiring attention
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>STO</TableHead>
              <TableHead>DSLT</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Blockers</TableHead>
              <TableHead>Oldest</TableHead>
              <TableHead>Next Gate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Escalate To</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {escalatedAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>
                  <PhaseIndicator phase={account.phase} showLabel={false} />
                </TableCell>
                <TableCell>{account.sto.name || account.sto.email.split('@')[0]}</TableCell>
                <TableCell>
                  <Badge variant={account.dsltDays > 2 ? "destructive" : "default"}>
                    {account.dsltDays}d
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusChip sentiment={account.sentiment} size="sm" />
                </TableCell>
                <TableCell>{account.blockersOpen}</TableCell>
                <TableCell>{account.oldestBlockerAgeD}d</TableCell>
                <TableCell>
                  {account.nextGateDue 
                    ? formatDistanceToNow(new Date(account.nextGateDue), { addSuffix: true })
                    : '-'}
                </TableCell>
                <TableCell>
                  <EscalationBadge 
                    state={account.escalationState} 
                    score={account.escalationScore}
                    showIcon={false}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getEscalateToSuggestion(account)}
                  </Badge>
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
