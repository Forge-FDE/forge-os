import { Card } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string | number
}

export function MetricCard({ title, value }: MetricCardProps) {
  return (
    <Card className="bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </Card>
  )
}
