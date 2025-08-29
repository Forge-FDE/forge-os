import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AccountHeader } from "@/components/account-detail/account-header"
import { AccountTabs } from "@/components/account-detail/account-tabs"

interface PageProps {
  params: { id: string }
}

export default async function AccountDetailPage({ params }: PageProps) {
  const account = await prisma.account.findUnique({
    where: { id: params.id },
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
    <div className="space-y-6">
      <AccountHeader account={account} />
      <AccountTabs account={account} />
    </div>
  )
}
