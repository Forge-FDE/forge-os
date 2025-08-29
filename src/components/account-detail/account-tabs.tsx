"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountOverview } from "./tabs/account-overview"
import { AccountWorkflows } from "./tabs/account-workflows"
import { AccountActions } from "./tabs/account-actions"
import { AccountStakeholders } from "./tabs/account-stakeholders"
import { AccountHistory } from "./tabs/account-history"

interface Workflow {
  id: string
  name: string
  phase: string
  ownerFde?: { name: string | null; email: string }
}

interface Action {
  id: string
  status: string
  severity: string
  title: string
  openedAt: Date
}

interface Stakeholder {
  id: string
  name: string
  email: string
  role: string
  sentiments?: Array<{ sentiment: string; date: Date }>
}

interface Touch {
  id: string
  type: string
  touchedAt: Date
  notes: string | null
}

interface AccountTabsProps {
  account: {
    id: string
    name: string
    codename: string | null
    phase: string
    volume7d: number
    revenue7d: number
    cost7d: number
    gm7d: number
    qcPct7d: number
    aht7d: number
    p95ms7d: number
    automation7d: number
    notes: string | null
    workflows: Array<Workflow>
    actions: Array<Action>
    stakeholders: Array<Stakeholder>
    touches: Array<Touch>
  }
}

export function AccountTabs({ account }: AccountTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="workflows">
          Workflows ({account.workflows.length})
        </TabsTrigger>
        <TabsTrigger value="actions">
          Actions ({account.actions.filter((a) => a.status !== 'closed').length})
        </TabsTrigger>
        <TabsTrigger value="stakeholders">
          Stakeholders ({account.stakeholders.length})
        </TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <AccountOverview account={account} />
      </TabsContent>
      
      <TabsContent value="workflows">
        <AccountWorkflows workflows={account.workflows} />
      </TabsContent>
      
      <TabsContent value="actions">
        <AccountActions actions={account.actions} />
      </TabsContent>
      
      <TabsContent value="stakeholders">
        <AccountStakeholders 
          stakeholders={account.stakeholders} 
        />
      </TabsContent>
      
      <TabsContent value="history">
        <AccountHistory touches={account.touches} />
      </TabsContent>
    </Tabs>
  )
}
