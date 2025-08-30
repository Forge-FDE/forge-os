"use client"

import React, { useState } from "react"
import { Users, MessageSquare, Mail, Phone } from "lucide-react"

interface Touch {
  id: string
  touchedAt: Date
  actor: string
  channel: string
  summary: string | null
}

interface StakeholderTrackingProps {
  workflow: {
    id: string
    account: {
      id: string
      sto: { name: string | null } | null
      sponsor: string | null
      champion: string | null
    }
  }
  touches: Touch[]
}

const channelTypeIcons: Record<string, { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>, color: string }> = {
  'email': { icon: Mail, color: '#2563eb' },
  'call': { icon: Phone, color: '#059669' },
  'team': { icon: Users, color: '#7c3aed' },
  'exec': { icon: MessageSquare, color: '#f59e0b' }
}

export function StakeholderTracking({ workflow, touches }: StakeholderTrackingProps) {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null)

  // Extract stakeholders
  const stakeholders = [
    {
      id: 'sto',
      name: workflow.account.sto?.name || 'Unassigned',
      role: 'STO',
      sentiment: 'NEUTRAL', // In real app, this would come from data
      lastContact: null as Date | null,
      communicationCount: 0
    },
    {
      id: 'sponsor',
      name: workflow.account.sponsor || 'Unassigned',
      role: 'Sponsor',
      sentiment: 'POSITIVE',
      lastContact: null as Date | null,
      communicationCount: 0
    },
    {
      id: 'champion',
      name: workflow.account.champion || 'Unassigned',
      role: 'Champion',
      sentiment: 'POSITIVE',
      lastContact: null as Date | null,
      communicationCount: 0
    }
  ]

  // Calculate communication stats for each stakeholder
  stakeholders.forEach(stakeholder => {
    const stakeholderTouches = touches.filter(touch => 
      touch.actor === stakeholder.name
    )
    
    stakeholder.communicationCount = stakeholderTouches.length
    if (stakeholderTouches.length > 0) {
      stakeholder.lastContact = new Date(Math.max(...stakeholderTouches.map(t => new Date(t.touchedAt).getTime())))
    }
  })

  const sentimentColors: Record<string, string> = {
    'POSITIVE': '#10b981',
    'NEUTRAL': '#f59e0b',
    'NEGATIVE': '#ef4444',
    'CRITICAL': '#dc2626'
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'No contact'
    const days = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    return `${days} days ago`
  }

  const formatTimestamp = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredTouches = selectedStakeholder
    ? touches.filter(touch => {
        const stakeholder = stakeholders.find(s => s.id === selectedStakeholder)
        return stakeholder && touch.actor === stakeholder.name
      })
    : touches

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <Users size={20} style={{ color: '#2563eb' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Stakeholder Communication Tracking
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '24px',
        height: '400px'
      }}>
        {/* Stakeholders Panel */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 16px 0'
          }}>
            Key Stakeholders
          </h4>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {stakeholders.map((stakeholder) => (
              <div
                key={stakeholder.id}
                onClick={() => setSelectedStakeholder(
                  selectedStakeholder === stakeholder.id ? null : stakeholder.id
                )}
                style={{
                  padding: '16px',
                  backgroundColor: selectedStakeholder === stakeholder.id ? '#eff6ff' : '#f9fafb',
                  borderRadius: '8px',
                  border: selectedStakeholder === stakeholder.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '8px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '2px'
                    }}>
                      {stakeholder.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {stakeholder.role}
                    </div>
                  </div>
                  
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: sentimentColors[stakeholder.sentiment] || '#d1d5db'
                    }}
                    title={`Sentiment: ${stakeholder.sentiment.toLowerCase()}`}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '11px',
                  color: '#6b7280'
                }}>
                  <span>{stakeholder.communicationCount} communications</span>
                  <span>{formatDate(stakeholder.lastContact)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Communication Summary */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              Total Communications
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {touches.length}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              marginTop: '4px'
            }}>
              Last 30 days
            </div>
          </div>
        </div>

        {/* Communications Timeline */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              margin: 0
            }}>
              Communication Timeline
              {selectedStakeholder && (
                <span style={{ color: '#6b7280', fontWeight: '400' }}>
                  {' '}for {stakeholders.find(s => s.id === selectedStakeholder)?.name}
                </span>
              )}
            </h4>
            
            {selectedStakeholder && (
              <button
                onClick={() => setSelectedStakeholder(null)}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Show All
              </button>
            )}
          </div>

          <div style={{
            height: '320px',
            overflowY: 'auto',
            border: '1px solid #e5e7eb',
            borderRadius: '6px'
          }}>
            {filteredTouches.length === 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#6b7280'
              }}>
                No communications found
              </div>
            ) : (
              <div style={{ padding: '16px' }}>
                {filteredTouches.map((touch, index) => {
                  const typeConfig = channelTypeIcons[touch.channel] || channelTypeIcons['team']
                  const IconComponent = typeConfig.icon
                  
                  return (
                    <div
                      key={touch.id}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        paddingBottom: '16px',
                        marginBottom: index < filteredTouches.length - 1 ? '16px' : 0,
                        borderBottom: index < filteredTouches.length - 1 ? '1px solid #f3f4f6' : 'none'
                      }}
                    >
                      <div style={{
                        flexShrink: 0,
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: `${typeConfig.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComponent size={16} style={{ color: typeConfig.color }} />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '4px'
                        }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#111827'
                          }}>
                            {touch.channel.toUpperCase()} Touch
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            whiteSpace: 'nowrap'
                          }}>
                            {formatTimestamp(touch.touchedAt)}
                          </div>
                        </div>
                        
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '4px'
                        }}>
                          {touch.actor}
                        </div>
                        
                        {touch.summary && (
                          <div style={{
                            fontSize: '12px',
                            color: '#374151',
                            lineHeight: '1.4',
                            maxHeight: '40px',
                            overflow: 'hidden'
                          }}>
                            {touch.summary.length > 100 ? 
                              `${touch.summary.substring(0, 100)}...` : 
                              touch.summary
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
