"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountOverview } from "./tabs/account-overview"
import { AccountWorkflows } from "./tabs/account-workflows"
import { AccountActions } from "./tabs/account-actions"
import { AccountStakeholders } from "./tabs/account-stakeholders"
import { AccountHistory } from "./tabs/account-history"

interface AccountTabsProps {
  account: {
    // Core Account fields from Prisma schema
    id: string
    name: string
    codename: string | null
    phase: string
    sponsor: string | null
    champion: string | null
    sentiment: string | null
    dsltDays: number
    nextGateDue: Date | null
    escalationState: string
    escalationScore: number
    volume7d: number
    revenue7d: number
    cost7d: number
    gm7d: number
    qcPct7d: number
    aht7d: number
    p95ms7d: number
    automation7d: number
    blockersOpen: number
    oldestBlockerAgeD: number
    notes: string | null
    
    // Relations exactly as returned by Prisma query
    sto: {
      id: string
      name: string | null
      email: string
      role: string
      createdAt: Date
      emailVerified: Date | null
      image: string | null
    } | null
    
    workflows: Array<{
      id: string
      name: string | null
      ownerFde?: {
        id: string
        name: string | null
        email: string
        role: string
        createdAt: Date
        emailVerified: Date | null
        image: string | null
      } | null
    }>
    
    actions: Array<{
      id: string
      status: string
      severity: string
      title: string
      openedAt: Date
    }>
    
    stakeholders: Array<{
      id: string
      name: string
      role: string
      contact: string | null
      accountId: string
      sentiments: Array<{
        id: string
        sentiment: string
        notes: string | null
        date: Date
        accountId: string
        stakeholderId: string
      }>
    }>
    
    touches: Array<{
      id: string
      type: string
      touchedAt: Date
      notes: string | null
    }>
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
