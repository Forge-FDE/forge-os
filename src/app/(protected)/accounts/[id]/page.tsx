import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AccountHeader } from "@/components/account-detail/account-header"
import { AccountTabs } from "@/components/account-detail/account-tabs"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AccountDetailPage({ params }: PageProps) {
  const { id } = await params
  const account = await prisma.account.findUnique({
    where: { id },
    include: {
      sto: true,
      workflows: {
        include: {
          ownerFde: true,
        },
      },
      actions: {
        orderBy: { openedAt: 'desc' },
      },
      touches: {
        orderBy: { touchedAt: 'desc' },
        take: 50,
      },
      stakeholders: {
        include: {
          sentiments: {
            orderBy: { date: 'desc' },
            take: 1,
          },
        },
      },
    },
  })
  
  if (!account) {
    notFound()
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <AccountHeader account={account} />
      <AccountTabs account={account} />
    </div>
  )
}
