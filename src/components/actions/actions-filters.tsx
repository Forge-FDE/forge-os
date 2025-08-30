"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
  
  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px',
    color: '#374151',
    minWidth: '150px',
    cursor: 'pointer'
  }
  
  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'none'
  }
  
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      <select
        style={selectStyle}
        value={searchParams.get('severity') || 'all'}
        onChange={(e) => updateFilter('severity', e.target.value)}
      >
        <option value="all">All Severities</option>
        <option value="sev-0">SEV-0</option>
        <option value="sev-1">SEV-1</option>
        <option value="sev-2">SEV-2</option>
      </select>

      <select
        style={selectStyle}
        value={searchParams.get('account') || 'all'}
        onChange={(e) => updateFilter('account', e.target.value)}
      >
        <option value="all">All Accounts</option>
        {accounts.map(account => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>

      <select
        style={selectStyle}
        value={searchParams.get('responsible') || 'all'}
        onChange={(e) => updateFilter('responsible', e.target.value)}
      >
        <option value="all">All Owners</option>
        {responsibles.map(responsible => (
          <option key={responsible} value={responsible}>
            {responsible}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
          Clear
        </button>
      )}
    </div>
  )
}