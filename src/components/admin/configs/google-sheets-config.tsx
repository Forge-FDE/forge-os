"use client"

import { useState } from "react"
import { Plus, Trash2, Edit2, Save, X } from "lucide-react"

interface IngestionSource {
  id: string
  accountName: string
  spreadsheetId: string
  tab: string | null
  active: boolean
  lastRunAt: Date | null
  lastStatus: string | null
}

interface GoogleSheetsConfigProps {
  sources: IngestionSource[]
}

export function GoogleSheetsConfig({ sources: initialSources }: GoogleSheetsConfigProps) {
  const [sources, setSources] = useState(initialSources)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newSource, setNewSource] = useState({
    accountName: '',
    spreadsheetId: '',
    tab: '',
    active: true
  })

  const handleAddNew = async () => {
    if (!newSource.accountName || !newSource.spreadsheetId) return

    try {
      const response = await fetch('/api/admin/ingestion-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource)
      })

      if (response.ok) {
        const created = await response.json()
        setSources(prev => [...prev, created])
        setNewSource({ accountName: '', spreadsheetId: '', tab: '', active: true })
        setIsAddingNew(false)
      }
    } catch (error) {
      console.error('Failed to add source:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ingestion-sources/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSources(prev => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete source:', error)
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/admin/ingestion-sources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      })

      if (response.ok) {
        setSources(prev => prev.map(s => 
          s.id === id ? { ...s, active: !active } : s
        ))
      }
    } catch (error) {
      console.error('Failed to update source:', error)
    }
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            Google Sheets Configuration
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0'
          }}>
            Manage Google Sheets for data ingestion
          </p>
        </div>
        
        <button
          onClick={() => setIsAddingNew(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Sheet
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        {/* Add New Form */}
        {isAddingNew && (
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Account Name *
                </label>
                <input
                  type="text"
                  value={newSource.accountName}
                  onChange={(e) => setNewSource(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="e.g., Coinbase"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Google Sheet ID *
                </label>
                <input
                  type="text"
                  value={newSource.spreadsheetId}
                  onChange={(e) => setNewSource(prev => ({ ...prev, spreadsheetId: e.target.value }))}
                  placeholder="1ABC...XYZ"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '4px'
                }}>
                  Tab Name (Optional)
                </label>
                <input
                  type="text"
                  value={newSource.tab}
                  onChange={(e) => setNewSource(prev => ({ ...prev, tab: e.target.value }))}
                  placeholder="Sheet1"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setIsAddingNew(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
              <button
                onClick={handleAddNew}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <Save style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        )}

        {/* Sources List */}
        {sources.length === 0 && !isAddingNew ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
          }}>
            <p>No Google Sheets configured yet.</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Add your first sheet to start data ingestion.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sources.map((source) => (
              <div
                key={source.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: source.active ? 'white' : '#f9fafb'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1' }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: source.active ? '#111827' : '#6b7280'
                  }}>
                    {source.accountName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    Sheet: {source.spreadsheetId.slice(0, 20)}...
                    {source.tab && ` (${source.tab})`}
                  </div>
                  {source.lastRunAt && (
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Last run: {new Date(source.lastRunAt).toLocaleDateString()} - 
                      <span style={{
                        color: source.lastStatus === 'success' ? '#059669' : '#dc2626',
                        marginLeft: '4px'
                      }}>
                        {source.lastStatus || 'unknown'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Active Toggle */}
                  <button
                    onClick={() => handleToggleActive(source.id, source.active)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: source.active ? '#dcfce7' : '#fef3c7',
                      color: source.active ? '#166534' : '#92400e'
                    }}
                  >
                    {source.active ? 'Active' : 'Inactive'}
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(source.id)}
                    style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid #fca5a5',
                      borderRadius: '6px',
                      color: '#dc2626',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
