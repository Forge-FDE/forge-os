"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, PlayCircle } from "lucide-react"

export function IngestionTrigger() {
  const [isRunning, setIsRunning] = useState(false)
  const { toast } = useToast()
  
  const handleRunIngestion = async () => {
    setIsRunning(true)
    
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'x-etl-token': process.env.NEXT_PUBLIC_ETL_TOKEN || 'development-etl-token-change-in-production',
        },
      })
      
      const result = await response.json()
      
      if (response.ok) {
        toast({
          title: "Ingestion Complete",
          description: `Processed ${result.accountsProcessed} accounts, ${result.actionsProcessed} actions, ${result.touchesProcessed} touches`,
        })
      } else {
        toast({
          title: "Ingestion Failed",
          description: result.error || "An error occurred during ingestion",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger ingestion",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }
  
  return (
    <Button 
      onClick={handleRunIngestion} 
      disabled={isRunning}
      className="w-full"
    >
      {isRunning ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Running...
        </>
      ) : (
        <>
          <PlayCircle className="mr-2 h-4 w-4" />
          Run Ingestion Now
        </>
      )}
    </Button>
  )
}
