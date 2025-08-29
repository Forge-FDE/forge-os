import { cn } from "@/lib/utils"
import { Phase } from "@prisma/client"

interface PhaseIndicatorProps {
  phase: Phase
  className?: string
  showLabel?: boolean
}

const phaseConfig = {
  P0_ALIGN: { label: "0: Alignment", color: "bg-slate-500" },
  P1_PILOT: { label: "1: Pilot", color: "bg-blue-500" },
  P2_EXPANSION: { label: "2: Expansion", color: "bg-purple-500" },
  P3_ENTERPRISE: { label: "3: Enterprise", color: "bg-green-500" },
  P4_HANDOFF: { label: "4: Handoff", color: "bg-gray-500" },
}

export function PhaseIndicator({ phase, className, showLabel = true }: PhaseIndicatorProps) {
  const config = phaseConfig[phase]
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex gap-1">
        {Object.entries(phaseConfig).map(([key, val]) => (
          <div
            key={key}
            className={cn(
              "h-2 w-8 rounded-full transition-colors",
              key === phase ? val.color : "bg-gray-200 dark:bg-gray-700"
            )}
          />
        ))}
      </div>
      {showLabel && (
        <span className="text-sm font-medium">{config.label}</span>
      )}
    </div>
  )
}
