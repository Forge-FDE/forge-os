"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, User, Building2, Target } from "lucide-react"

interface WorkflowHeaderProps {
  workflow: {
    id: string
    name: string
    phase: string
    statusNote: string | null
    dueDate: Date | null
    wgSentiment: string | null
    account: {
      id: string
      name: string
      codename: string | null
      sto: { name: string | null } | null
      sponsor: string | null
      champion: string | null
    }
    ownerFde: { name: string | null } | null
  }
}

const phaseColors: Record<string, { backgroundColor: string; color: string }> = {
  'P0_ALIGN': { backgroundColor: '#fef3c7', color: '#d97706' },
  'P1_PILOT': { backgroundColor: '#dbeafe', color: '#2563eb' },
  'P2_SCALING': { backgroundColor: '#d1fae5', color: '#059669' },
  'P3_SCALEUP': { backgroundColor: '#fce7f3', color: '#c2410c' },
  'P4_HANDOFF': { backgroundColor: '#fed7d7', color: '#e53e3e' }
}

// Status is determined from statusNote field
const getStatusFromNote = (statusNote: string | null) => {
  if (!statusNote) return 'ACTIVE'
  const note = statusNote.toLowerCase()
  if (note.includes('complete') || note.includes('done')) return 'COMPLETED'
  if (note.includes('escalate') || note.includes('risk')) return 'ESCALATED'
  if (note.includes('hold') || note.includes('pause')) return 'ON_HOLD'
  return 'ACTIVE'
}

const statusColors: Record<string, { backgroundColor: string; color: string }> = {
  'ACTIVE': { backgroundColor: '#d1fae5', color: '#059669' },
  'ON_HOLD': { backgroundColor: '#fef3c7', color: '#d97706' },
  'ESCALATED': { backgroundColor: '#fed7d7', color: '#e53e3e' },
  'COMPLETED': { backgroundColor: '#e0e7ff', color: '#4338ca' }
}

const sentimentColors: Record<string, string> = {
  'POSITIVE': '#10b981',
  'NEUTRAL': '#f59e0b', 
  'NEGATIVE': '#ef4444',
  'CRITICAL': '#dc2626'
}

export function WorkflowHeader({ workflow }: WorkflowHeaderProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const workflowStatus = getStatusFromNote(workflow.statusNote)

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <Link 
          href="/dashboard" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#6b7280',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      {/* Workflow Title & Status */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0 0 8px 0'
          }}>
            {workflow.name}
          </h1>
          <Link 
            href={`/accounts/${workflow.account.id}`}
            style={{
              fontSize: '16px',
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            {workflow.account.name} {workflow.account.codename && `(${workflow.account.codename})`}
          </Link>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            ...phaseColors[workflow.phase] || { backgroundColor: '#f3f4f6', color: '#374151' }
          }}>
            {workflow.phase.replace('_', ' ')}
          </span>
          
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase',
            ...statusColors[workflowStatus] || { backgroundColor: '#f3f4f6', color: '#374151' }
          }}>
            {workflowStatus.replace('_', ' ')}
          </span>

          {workflow.wgSentiment && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: '#f3f4f6'
            }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: sentimentColors[workflow.wgSentiment] || '#d1d5db'
                }}
              />
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                textTransform: 'capitalize'
              }}>
                {workflow.wgSentiment.toLowerCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Key Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={20} style={{ color: '#6b7280' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              Owner
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {workflow.ownerFde?.name || 'Unassigned'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calendar size={20} style={{ color: '#6b7280' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              Due Date
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: workflow.dueDate && new Date(workflow.dueDate) < new Date() ? '#ef4444' : '#111827' 
            }}>
              {formatDate(workflow.dueDate)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Building2 size={20} style={{ color: '#6b7280' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              STO
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {workflow.account.sto?.name || 'Unassigned'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Target size={20} style={{ color: '#6b7280' }} />
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
              Champion
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
              {workflow.account.champion || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
