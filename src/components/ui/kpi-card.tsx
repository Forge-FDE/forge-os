import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  delta?: number
  deltaType?: "positive" | "negative" | "neutral"
  description?: string
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  delta, 
  deltaType = "neutral", 
  description,
  className 
}: KPICardProps) {
  const deltaIcons = {
    positive: ArrowUp,
    negative: ArrowDown,
    neutral: Minus,
  }
  
  const deltaColors = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-gray-600",
  }
  
  const DeltaIcon = delta !== undefined ? deltaIcons[deltaType] : null
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {delta !== undefined && DeltaIcon && (
          <div className={cn("flex items-center text-xs", deltaColors[deltaType])}>
            <DeltaIcon className="h-3 w-3 mr-1" />
            <span>{Math.abs(delta)}%</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
