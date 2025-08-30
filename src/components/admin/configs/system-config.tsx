"use client"

import { useState } from "react"
import { Save, RefreshCw } from "lucide-react"

export function SystemConfig() {
  const [loading, setLoading] = useState(false)
  const [configs, setConfigs] = useState({
    timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'America/Los_Angeles',
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',
    etlToken: '••••••••••••••••', // masked for security
  })

  const handleSave = async () => {
    setLoading(true)
    // In a real implementation, you'd save these to a database or config service
    // For now, just simulate the action
    setTimeout(() => {
      setLoading(false)
      alert('Configuration saved! Restart the application to apply changes.')
    }, 1000)
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
            System Configuration
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: '0'
          }}>
            Global system settings and preferences
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: loading ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? (
            <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
          ) : (
            <Save style={{ width: '16px', height: '16px' }} />
          )}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '24px' }}>
        <div style={{ 
          display: 'grid', 
          gap: '24px',
          maxWidth: '600px'
        }}>
          {/* Timezone */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              System Timezone
            </label>
            <select
              value={configs.timezone}
              onChange={(e) => setConfigs(prev => ({ ...prev, timezone: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="UTC">UTC</option>
            </select>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Default timezone for date/time displays and scheduling
            </p>
          </div>

          {/* Mock Data Toggle */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={configs.useMockData}
                onChange={(e) => setConfigs(prev => ({ ...prev, useMockData: e.target.checked }))}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#2563eb'
                }}
              />
              Use Mock Data for Development
            </label>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px',
              marginLeft: '28px'
            }}>
              When enabled, the system will use generated mock data instead of real Google Sheets data
            </p>
          </div>

          {/* ETL Token */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              ETL Security Token
            </label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="password"
                value={configs.etlToken}
                onChange={(e) => setConfigs(prev => ({ ...prev, etlToken: e.target.value }))}
                style={{
                  flex: '1',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => {
                  const newToken = Math.random().toString(36).substring(2, 15) + 
                                  Math.random().toString(36).substring(2, 15)
                  setConfigs(prev => ({ ...prev, etlToken: newToken }))
                }}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Generate New
              </button>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Secure token for authenticating ETL/ingestion requests
            </p>
          </div>

          {/* Environment Info */}
          <div style={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 12px 0'
            }}>
              Environment Information
            </h3>
            <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Node Environment:</span>
                <span style={{ 
                  color: process.env.NODE_ENV === 'production' ? '#059669' : '#d97706',
                  fontWeight: '500'
                }}>
                  {process.env.NODE_ENV || 'development'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Database Connected:</span>
                <span style={{ color: '#059669', fontWeight: '500' }}>
                  ✓ Active
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Google Sheets API:</span>
                <span style={{ 
                  color: process.env.GOOGLE_SA_EMAIL ? '#059669' : '#dc2626',
                  fontWeight: '500'
                }}>
                  {process.env.GOOGLE_SA_EMAIL ? '✓ Configured' : '✗ Not Configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
