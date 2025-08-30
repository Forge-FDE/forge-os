"use client"

import { useMemo } from "react"
import { Calendar, User, AlertTriangle } from "lucide-react"

interface Action {
  id: string
  title: string
  status: string
  severity: string
  responsible: string
  dueDate: Date | null
  openedAt: Date
  lastUpdate: Date
}

interface WorkflowGanttProps {
  actions: Action[]
}

const severityColors: Record<string, string> = {
  'sev-2': '#10b981',
  'sev-1': '#f59e0b', 
  'sev-0': '#ef4444'
}

const statusColors: Record<string, { backgroundColor: string; color: string }> = {
  'open': { backgroundColor: '#dbeafe', color: '#2563eb' },
  'at_risk': { backgroundColor: '#fed7d7', color: '#dc2626' },
  'closed': { backgroundColor: '#d1fae5', color: '#059669' }
}

export function WorkflowGantt({ actions }: WorkflowGanttProps) {
  const { timelineData, startDate, endDate, totalDays } = useMemo(() => {
    if (actions.length === 0) {
      const now = new Date()
      return {
        timelineData: [],
        startDate: now,
        endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        totalDays: 30
      }
    }

    // Find date range
    const dates = actions
      .map(action => action.dueDate ? new Date(action.dueDate) : null)
      .filter(date => date !== null) as Date[]
    
    const now = new Date()
    dates.push(now)
    
    const start = new Date(Math.min(...dates.map(d => d.getTime())))
    const end = new Date(Math.max(...dates.map(d => d.getTime())))
    
    // Add buffer
    start.setDate(start.getDate() - 7)
    end.setDate(end.getDate() + 7)
    
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Process actions for timeline
    const timeline = actions.map(action => {
      const actionStart = new Date(action.openedAt)
      const actionEnd = action.dueDate ? new Date(action.dueDate) : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      const startOffset = Math.max(0, (actionStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      const duration = Math.max(1, (actionEnd.getTime() - actionStart.getTime()) / (1000 * 60 * 60 * 24))
      
      return {
        ...action,
        startOffset: (startOffset / days) * 100,
        duration: (duration / days) * 100,
        isOverdue: action.dueDate ? new Date(action.dueDate) < now && action.status !== 'closed' : false
      }
    })
    
    return {
      timelineData: timeline,
      startDate: start,
      endDate: end,
      totalDays: days
    }
  }, [actions])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Generate month markers
  const monthMarkers = useMemo(() => {
    const markers = []
    const current = new Date(startDate)
    current.setDate(1) // Start of month
    
    while (current <= endDate) {
      const offset = ((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays * 100
      if (offset >= 0 && offset <= 100) {
        markers.push({
          offset,
          label: current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        })
      }
      current.setMonth(current.getMonth() + 1)
    }
    
    return markers
  }, [startDate, endDate, totalDays])

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <Calendar size={20} style={{ color: '#2563eb' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Action Items Timeline
        </h3>
      </div>

      {actions.length === 0 ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#6b7280',
          fontSize: '16px'
        }}>
          No actions found for this workflow
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          {/* Timeline Header */}
          <div style={{
            position: 'relative',
            height: '40px',
            marginBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {monthMarkers.map((marker, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${marker.offset}%`,
                  top: 0,
                  height: '100%',
                  borderLeft: '1px solid #d1d5db',
                  paddingLeft: '8px',
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500'
                }}
              >
                {marker.label}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            overflowY: 'auto',
            height: 'calc(100% - 56px)'
          }}>
            {timelineData.map((action) => (
              <div key={action.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                minHeight: '60px'
              }}>
                {/* Action Info */}
                <div style={{ flex: '0 0 250px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: severityColors[action.severity] || '#d1d5db'
                      }}
                    />
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827'
                    }}>
                      {action.title}
                    </span>
                    {action.isOverdue && (
                      <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    <User size={12} />
                    <span>{action.responsible || 'Unassigned'}</span>
                  </div>
                  
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600',
                    marginTop: '4px',
                    display: 'inline-block',
                    ...statusColors[action.status] || statusColors['TODO']
                  }}>
                    {action.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Timeline Bar */}
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '10px'
                }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: `${action.startOffset}%`,
                      width: `${Math.max(2, action.duration)}%`,
                      height: '100%',
                      backgroundColor: action.isOverdue ? '#ef4444' : 
                        statusColors[action.status]?.backgroundColor || '#2563eb',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  
                  {/* Due date marker */}
                  {action.dueDate && (
                    <div
                      style={{
                        position: 'absolute',
                        left: `${action.startOffset + action.duration}%`,
                        top: '-6px',
                        width: '2px',
                        height: '32px',
                        backgroundColor: '#374151',
                        transform: 'translateX(-1px)'
                      }}
                    />
                  )}
                </div>

                {/* Due Date */}
                <div style={{
                  flex: '0 0 80px',
                  textAlign: 'right',
                  fontSize: '12px',
                  color: action.isOverdue ? '#ef4444' : '#6b7280',
                  fontWeight: '500'
                }}>
                  {action.dueDate ? formatDate(new Date(action.dueDate)) : 'No due date'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
