"use client"

import { useState } from "react"
import { OwnerLoadV2 } from "./owner-load-v2"
import { PaidAccountsV2 } from "./paid-accounts-v2"

interface DashboardContentProps {
  accounts: Array<{
    id: string
    name: string
    revenue7d: number
    cost7d: number
    gm7d: number
    volume7d: number
    qcPct7d: number
    aht7d: number
    stoId: string
  }>
  owners: Array<{
    id: string
    name: string | null
    email: string
    _count: {
      accounts: number
    }
  }>
}

export function DashboardContent({ accounts, owners }: DashboardContentProps) {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null)

  // Filter accounts by selected owner if one is selected
  const filteredAccounts = selectedOwnerId 
    ? accounts.filter(account => account.stoId === selectedOwnerId)
    : accounts

  return (
    <>
      {/* Left Column - All Accounts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <PaidAccountsV2 
          accounts={filteredAccounts} 
          title={selectedOwnerId ? `${owners.find(o => o.id === selectedOwnerId)?.name}'s Accounts` : "All Accounts"}
        />
      </div>
      
      {/* Right Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <OwnerLoadV2 
          data={owners} 
          selectedOwnerId={selectedOwnerId}
          onOwnerSelect={setSelectedOwnerId}
        />
        <PaidAccountsV2 
          accounts={accounts.filter(a => a.revenue7d > 0)} 
          compact={true}
          title="Top Paid Accounts"
        />
      </div>
    </>
  )
}
