"use client"

import { BarChart3, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

interface WorkflowStatsProps {
  workflow: {
    id: string
    name: string
    statusNote: string | null
    dueDate: Date | null
    account: {
      revenue7d: number
      cost7d: number
      volume7d: number
      qcPct7d: number
      escalationScore: number
    }
    actions: Array<{
      id: string
      status: string
      severity: string
      dueDate: Date | null
      openedAt: Date
    }>
  }
}

export function WorkflowStats({ workflow }: WorkflowStatsProps) {
  // Calculate action statistics
  const actionStats = {
    total: workflow.actions.length,
    completed: workflow.actions.filter(a => a.status === 'closed').length,
    inProgress: workflow.actions.filter(a => a.status === 'open').length,
    overdue: workflow.actions.filter(a => 
      a.dueDate && new Date(a.dueDate) < new Date() && a.status !== 'closed'
    ).length,
    critical: workflow.actions.filter(a => a.severity === 'sev-0').length
  }

  const completionRate = actionStats.total > 0 ? 
    (actionStats.completed / actionStats.total * 100) : 0

  // Calculate timeline stats - estimate age from oldest action
  const oldestAction = workflow.actions.length > 0 ? 
    workflow.actions.reduce((oldest, action) => 
      new Date(action.openedAt) < new Date(oldest.openedAt) ? action : oldest
    ) : null

  const workflowAge = oldestAction ? 
    Math.ceil((new Date().getTime() - new Date(oldestAction.openedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0

  const daysRemaining = workflow.dueDate ? 
    Math.ceil((new Date(workflow.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  // Format currency
  const formatCurrency = (value: number) => {
    if (!value) return '$0'
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return `$${value.toFixed(0)}`
  }

  // Format percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const stats = [
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: CheckCircle,
      color: completionRate >= 80 ? '#10b981' : completionRate >= 60 ? '#f59e0b' : '#ef4444',
      change: null
    },
    {
      label: 'Actions Complete',
      value: `${actionStats.completed}/${actionStats.total}`,
      icon: BarChart3,
      color: actionStats.completed === actionStats.total ? '#10b981' : '#2563eb',
      change: null
    },
    {
      label: 'Days Active',
      value: workflowAge.toString(),
      icon: Clock,
      color: workflowAge <= 30 ? '#10b981' : workflowAge <= 60 ? '#f59e0b' : '#ef4444',
      change: daysRemaining ? `${daysRemaining} days left` : null
    },
    {
      label: 'Overdue Actions',
      value: actionStats.overdue.toString(),
      icon: AlertCircle,
      color: actionStats.overdue === 0 ? '#10b981' : '#ef4444',
      change: actionStats.critical > 0 ? `${actionStats.critical} critical` : null
    }
  ]

  const accountMetrics = [
    {
      label: 'Revenue (7d)',
      value: formatCurrency(workflow.account.revenue7d),
      change: null
    },
    {
      label: 'Cost (7d)',
      value: formatCurrency(workflow.account.cost7d),
      change: null
    },
    {
      label: 'Volume (7d)',
      value: workflow.account.volume7d.toLocaleString(),
      change: null
    },
    {
      label: 'QC Rate',
      value: formatPercent(workflow.account.qcPct7d),
      change: null
    },
    {
      label: 'Escalation Score',
      value: workflow.account.escalationScore.toString(),
      change: null
    }
  ]

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <TrendingUp size={20} style={{ color: '#2563eb' }} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          margin: 0
        }}>
          Workflow Stats
        </h3>
      </div>

      {/* Workflow Progress Stats */}
      <div>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 16px 0'
        }}>
          Progress Overview
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <IconComponent size={16} style={{ color: stat.color }} />
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: stat.color
                  }}>
                    {stat.value}
                  </span>
                </div>
                
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  {stat.label}
                </div>
                
                {stat.change && (
                  <div style={{
                    fontSize: '11px',
                    color: '#9ca3af'
                  }}>
                    {stat.change}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Account Metrics */}
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          margin: '0 0 16px 0'
        }}>
          Account Metrics
        </h4>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {accountMetrics.map((metric, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderRadius: '6px'
            }}>
              <span style={{
                fontSize: '13px',
                color: '#6b7280'
              }}>
                {metric.label}
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827'
              }}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Indicator */}
      <div style={{
        padding: '16px',
        backgroundColor: workflow.statusNote?.toLowerCase().includes('complete') ? '#d1fae5' : 
                      workflow.statusNote?.toLowerCase().includes('escalate') ? '#fed7d7' : '#dbeafe',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '600',
          color: workflow.statusNote?.toLowerCase().includes('complete') ? '#059669' : 
                 workflow.statusNote?.toLowerCase().includes('escalate') ? '#dc2626' : '#2563eb',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {workflow.statusNote || 'ACTIVE'}
        </div>
        
        {daysRemaining !== null && (
          <div style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '4px'
          }}>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 
             daysRemaining === 0 ? 'Due today' : 
             `${Math.abs(daysRemaining)} days overdue`}
          </div>
        )}
      </div>
    </div>
  )
}
