"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ActionsFiltersProps {
  accounts: Array<{ id: string; name: string }>
  responsibles: string[]
}

export function ActionsFilters({ accounts, responsibles }: ActionsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/actions?${params.toString()}`)
  }
  
  const clearFilters = () => {
    router.push('/actions')
  }
  
  const hasFilters = searchParams.toString().length > 0
  
  return (
    <div className="flex flex-wrap gap-2">
      <Select
        value={searchParams.get('severity') || 'all'}
        onValueChange={(value) => updateFilter('severity', value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Severities" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severities</SelectItem>
          <SelectItem value="sev-0">SEV-0</SelectItem>
          <SelectItem value="sev-1">SEV-1</SelectItem>
          <SelectItem value="sev-2">SEV-2</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={searchParams.get('account') || 'all'}
        onValueChange={(value) => updateFilter('account', value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Accounts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Accounts</SelectItem>
          {accounts.map((account) => (
            <SelectItem key={account.id} value={account.id}>
              {account.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={searchParams.get('responsible') || 'all'}
        onValueChange={(value) => updateFilter('responsible', value)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="All Owners" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Owners</SelectItem>
          {responsibles.map((person) => (
            <SelectItem key={person} value={person}>
              {person}
            </SelectItem>
          ))}
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
