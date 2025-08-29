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
    workflows: Array<any>
    actions: Array<any>
    stakeholders: Array<any>
    touches: Array<any>
    // Allow any additional properties from the full account object
    [key: string]: any
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
