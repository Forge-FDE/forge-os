"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface AccountsFiltersProps {
  stos: Array<{
    id: string
    name: string | null
    email: string
  }>
}

export function AccountsFilters({ stos }: AccountsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/accounts?${params.toString()}`)
  }
  
  const clearFilters = () => {
    router.push('/accounts')
  }
  
  const hasFilters = searchParams.toString().length > 0
  
  return (
    <div className="flex flex-wrap gap-2">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search accounts..."
          className="pl-8"
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => {
            const value = e.target.value
            if (value) {
              updateFilter('search', value)
            } else {
              updateFilter('search', null)
            }
          }}
        />
      </div>
      
      <Select
        value={searchParams.get('phase') || ''}
        onValueChange={(value) => updateFilter('phase', value || null)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Phases" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Phases</SelectItem>
          <SelectItem value="P0_ALIGN">0: Alignment</SelectItem>
          <SelectItem value="P1_PILOT">1: Pilot</SelectItem>
          <SelectItem value="P2_EXPANSION">2: Expansion</SelectItem>
          <SelectItem value="P3_ENTERPRISE">3: Enterprise</SelectItem>
          <SelectItem value="P4_HANDOFF">4: Handoff</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={searchParams.get('sentiment') || ''}
        onValueChange={(value) => updateFilter('sentiment', value || null)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Sentiments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Sentiments</SelectItem>
          <SelectItem value="R">Red</SelectItem>
          <SelectItem value="Y">Yellow</SelectItem>
          <SelectItem value="G">Green</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={searchParams.get('sto') || ''}
        onValueChange={(value) => updateFilter('sto', value || null)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All STOs" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All STOs</SelectItem>
          {stos.map((sto) => (
            <SelectItem key={sto.id} value={sto.id}>
              {sto.name || sto.email.split('@')[0]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={searchParams.get('state') || ''}
        onValueChange={(value) => updateFilter('state', value || null)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All States</SelectItem>
          <SelectItem value="none">OK</SelectItem>
          <SelectItem value="watch">Watch</SelectItem>
          <SelectItem value="escalate">Escalate</SelectItem>
        </SelectContent>
      </Select>
      
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
