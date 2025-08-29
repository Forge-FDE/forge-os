"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountOverview } from "./tabs/account-overview"
import { AccountWorkflows } from "./tabs/account-workflows"
import { AccountActions } from "./tabs/account-actions"
import { AccountStakeholders } from "./tabs/account-stakeholders"
import { AccountHistory } from "./tabs/account-history"

interface AccountTabsProps {
  account: {
    id: string
    workflows: Array<{ id: string }>
    actions: Array<{ status: string }>
    stakeholders: Array<{ id: string }>
    touches: Array<{ id: string }>
  } & Record<string, unknown> // For additional properties
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
          Actions ({account.actions.filter((a: any) => a.status !== 'closed').length})
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
        <AccountActions actions={account.actions} accountId={account.id} />
      </TabsContent>
      
      <TabsContent value="stakeholders">
        <AccountStakeholders 
          stakeholders={account.stakeholders} 
          accountId={account.id} 
        />
      </TabsContent>
      
      <TabsContent value="history">
        <AccountHistory touches={account.touches} />
      </TabsContent>
    </Tabs>
  )
}
