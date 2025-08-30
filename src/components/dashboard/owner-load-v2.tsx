"use client"

import { useState } from "react"

interface OwnerLoadProps {
  data: Array<{
    id: string
    name: string | null
    email: string
    _count: {
      accounts: number
    }
  }>
  onOwnerSelect?: (ownerId: string | null) => void
  selectedOwnerId?: string | null
}

export function OwnerLoadV2({ data, onOwnerSelect, selectedOwnerId }: OwnerLoadProps) {
  const maxLoad = Math.max(...data.map(d => d._count.accounts)) || 1

  const handleOwnerClick = (ownerId: string) => {
    const newSelection = selectedOwnerId === ownerId ? null : ownerId
    onOwnerSelect?.(newSelection)
  }
  
  return (
    <div style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            Load by owner
          </h3>
          {selectedOwnerId && (
            <button
              onClick={() => onOwnerSelect?.(null)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear filter
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedOwnerId && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#dbeafe',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#1d4ed8'
          }}>
            📊 Filtering by: {data.find(o => o.id === selectedOwnerId)?.name || 'Selected owner'}
          </div>
        )}
        {data.map((owner) => {
          const load = owner._count.accounts
          const percentage = (load / maxLoad) * 100
          const isSelected = selectedOwnerId === owner.id
          
          return (
            <div 
              key={owner.id} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isSelected ? '#dbeafe' : 'transparent',
                border: isSelected ? '2px solid #2563eb' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleOwnerClick(owner.id)}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '14px' 
              }}>
                <span style={{ 
                  fontWeight: '500', 
                  color: isSelected ? '#0369a1' : '#111827' 
                }}>
                  {owner.name?.split(' ')[0] || owner.email.split('@')[0].toUpperCase()}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#6b7280' }}>
                    {owner.name?.split(' ')[1]?.toUpperCase() || 'FDE'}
                  </span>
                  <span style={{ 
                    fontWeight: '600', 
                    color: isSelected ? '#0369a1' : '#111827',
                    minWidth: '20px',
                    textAlign: 'right'
                  }}>
                    {load}
                  </span>
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                backgroundColor: '#e5e7eb', 
                borderRadius: '9999px', 
                height: '8px',
                overflow: 'hidden'
              }}>
                <div 
                  style={{ 
                    backgroundColor: isSelected ? '#0ea5e9' : '#6b7280', 
                    height: '8px', 
                    borderRadius: '9999px',
                    width: `${percentage}%`,
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              {isSelected && (
                <div style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '6px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#0369a1',
                    margin: '0'
                  }}>
                    📊 Managing {load} account{load !== 1 ? 's' : ''}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    margin: '4px 0 0 0'
                  }}>
                    Click accounts view to filter by this STO
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}