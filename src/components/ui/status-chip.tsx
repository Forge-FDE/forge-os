import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusChipProps {
  sentiment?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusChip({ sentiment, size = "md", className }: StatusChipProps) {
  if (!sentiment) return null
  
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-1",
    lg: "text-base px-3 py-1.5",
  }
  
  const colorClasses = {
    R: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    Y: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    G: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  }
  
  const label = {
    R: "Red",
    Y: "Yellow",
    G: "Green",
  }
  
  return (
    <Badge
      className={cn(
        sizeClasses[size],
        colorClasses[sentiment as keyof typeof colorClasses],
        className
      )}
      variant="outline"
    >
      {label[sentiment as keyof typeof label]}
    </Badge>
  )
}
