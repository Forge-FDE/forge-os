import { Card } from "@/components/ui/card"

interface OwnerLoadProps {
  data: Array<{
    id: string
    name: string | null
    email: string
    _count: {
      accounts: number
    }
  }>
}

export function OwnerLoadV2({ data }: OwnerLoadProps) {
  const maxLoad = Math.max(...data.map(d => d._count.accounts)) || 1
  
  return (
    <Card className="bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Load by owner</h3>
      </div>
      <div className="p-6 space-y-4">
        {data.map((owner) => {
          const load = owner._count.accounts
          const percentage = (load / maxLoad) * 100
          
          return (
            <div key={owner.id} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">
                  {owner.name?.split(' ')[0] || owner.email.split('@')[0].toUpperCase()}
                </span>
                <span className="text-gray-500">
                  {owner.name?.split(' ')[1]?.toUpperCase() || 'FDE'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
