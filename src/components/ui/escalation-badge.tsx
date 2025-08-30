import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"

interface EscalationBadgeProps {
  state: string
  score?: number
  showIcon?: boolean
  className?: string
}

export function EscalationBadge({ state, score, showIcon = true, className }: EscalationBadgeProps) {
  const config = {
    escalate: {
      label: "Escalate",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      icon: AlertTriangle,
    },
    watch: {
      label: "Watch",
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      icon: AlertCircle,
    },
    none: {
      label: "OK",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      icon: CheckCircle,
    },
  }

  const currentConfig = config[state as keyof typeof config] || config.none
  const Icon = currentConfig.icon

  return (
    <Badge
      className={cn(
        "gap-1",
        currentConfig.color,
        className
      )}
      variant="outline"
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {currentConfig.label}
      {score !== undefined && ` (${score})`}
    </Badge>
  )
}