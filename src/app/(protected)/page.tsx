import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function DashboardPage() {
  const session = await auth()

  // Fetch dashboard statistics
  const [
    totalAccounts,
    openActions,
    escalations,
    escalatedAccounts
  ] = await Promise.all([
    prisma.account.count(),
    prisma.action.count({
      where: { status: { in: ['open', 'at_risk'] } }
    }),
    prisma.account.count({
      where: { escalationState: { in: ['watch', 'escalate'] } }
    }),
    prisma.account.findMany({
      where: { escalationState: 'escalate' },
      select: {
        name: true,
        escalationScore: true,
        escalationState: true,
        sentiment: true,
        dsltDays: true,
        sto: {
          select: { name: true }
        }
      },
      orderBy: { escalationScore: 'desc' },
      take: 5
    })
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.email || 'User'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccounts}</div>
            <p className="text-xs text-muted-foreground">
              Active accounts in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openActions}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{escalations}</div>
            <p className="text-xs text-muted-foreground">
              Accounts at risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={session?.user?.role === "admin" ? "default" : "secondary"}>
              {session?.user?.role || 'viewer'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Queue</CardTitle>
          <CardDescription>
            Accounts requiring immediate attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {escalatedAccounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead>DSLT</TableHead>
                  <TableHead>STO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escalatedAccounts.map((account) => (
                  <TableRow key={account.name}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.escalationScore}</TableCell>
                    <TableCell>
                      <Badge variant={
                        account.sentiment === 'R' ? 'destructive' :
                        account.sentiment === 'Y' ? 'outline' : 'default'
                      }>
                        {account.sentiment || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.dsltDays}d</TableCell>
                    <TableCell>{account.sto.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground">
              No escalations at this time
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
