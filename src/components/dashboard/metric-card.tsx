interface MetricCardProps {
  title: string
  value: string | number
}

export function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div 
      style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <p style={{ 
        fontSize: '12px', 
        color: '#6b7280', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em',
        margin: '0'
      }}>
        {title}
      </p>
      <p style={{ 
        marginTop: '8px', 
        fontSize: '24px', 
        fontWeight: '600', 
        color: '#111827',
        margin: '8px 0 0 0'
      }}>
        {value}
      </p>
    </div>
  )
}
