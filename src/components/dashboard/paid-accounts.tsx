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
import { Sparkline } from "@/components/charts/sparkline"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PaidAccountsProps {
  accounts: Array<{
    id: string
    name: string
    revenue7d: number
    cost7d: number
    gm7d: number
    volume7d: number
    qcPct7d: number
    aht7d: number
  }>
}

export function PaidAccounts({ accounts }: PaidAccountsProps) {
  const paidAccounts = accounts.filter(a => a.revenue7d > 0)
  
  if (paidAccounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Paid Accounts</CardTitle>
          <CardDescription>Revenue-generating accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No paid accounts found.
          </p>
        </CardContent>
      </Card>
    )
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }
  
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paid Accounts</CardTitle>
        <CardDescription>
          {paidAccounts.length} revenue-generating account{paidAccounts.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Revenue (7d)</TableHead>
              <TableHead className="text-right">Cost (7d)</TableHead>
              <TableHead className="text-right">GM%</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">QC%</TableHead>
              <TableHead className="text-right">AHT</TableHead>
              <TableHead>Trend</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paidAccounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(account.revenue7d)}</TableCell>
                <TableCell className="text-right">{formatCurrency(account.cost7d)}</TableCell>
                <TableCell className="text-right">
                  <span className={account.gm7d > 0.3 ? "text-green-600" : ""}>
                    {formatPercent(account.gm7d)}
                  </span>
                </TableCell>
                <TableCell className="text-right">{account.volume7d.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className={account.qcPct7d >= 0.99 ? "text-green-600" : "text-amber-600"}>
                    {formatPercent(account.qcPct7d)}
                  </span>
                </TableCell>
                <TableCell className="text-right">{account.aht7d.toFixed(0)}s</TableCell>
                <TableCell className="w-24">
                  <Sparkline 
                    data={[
                      account.volume7d * 0.8,
                      account.volume7d * 0.9,
                      account.volume7d * 0.95,
                      account.volume7d,
                    ]}
                    height={30}
                  />
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
