import { TrendingUp, Shield, Clock, Target } from "lucide-react"

interface LeaderboardData {
  id: string
  name: string
  email: string
  metrics: {
    closedActions: number
    avgDslt: number
    greenAccounts: number
    totalAccounts: number
    escalations: number
    score: number
  }
}

interface LeaderboardCardsProps {
  data: LeaderboardData[]
}

export function LeaderboardCards({ data }: LeaderboardCardsProps) {
  const top3 = data.slice(0, 3)
  const medals = ["🥇", "🥈", "🥉"]
  
  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }

  const winnerCardStyle = {
    ...cardStyle,
    border: '2px solid #eab308'
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Performers */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {top3.map((person, index) => (
          <div key={person.id} style={index === 0 ? winnerCardStyle : cardStyle}>
            <div style={{ padding: '24px 24px 16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{medals[index]}</span>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {person.name[0].toUpperCase()}
                  </div>
                </div>
                <span style={{
                  border: '1px solid #d1d5db',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}>
                  {person.metrics.score} pts
                </span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0', color: '#111827' }}>
                {person.name}
              </h3>
            </div>
            <div style={{ padding: '0 24px 24px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Actions Closed</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{person.metrics.closedActions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Avg DSLT</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{person.metrics.avgDslt.toFixed(1)}d</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Green Accounts</span>
                  <span style={{ fontWeight: '500', color: '#111827' }}>{person.metrics.greenAccounts}/{person.metrics.totalAccounts}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Winners */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        <div style={cardStyle}>
          <div style={{ padding: '20px 20px 12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Target style={{ width: '16px', height: '16px', color: '#16a34a' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#111827' }}>Action Hero</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Most actions closed</p>
          </div>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              {data[0]?.name || "—"}
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
              {data[0]?.metrics.closedActions || 0} actions closed
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ padding: '20px 20px 12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Clock style={{ width: '16px', height: '16px', color: '#2563eb' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#111827' }}>DSLT Champion</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Best DSLT average</p>
          </div>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              {data.sort((a, b) => a.metrics.avgDslt - b.metrics.avgDslt)[0]?.name || "—"}
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
              {data[0]?.metrics.avgDslt.toFixed(1) || 0}d average
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ padding: '20px 20px 12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <TrendingUp style={{ width: '16px', height: '16px', color: '#7c3aed' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#111827' }}>Sentiment Star</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Most green accounts</p>
          </div>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              {data.sort((a, b) => b.metrics.greenAccounts - a.metrics.greenAccounts)[0]?.name || "—"}
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
              {data[0]?.metrics.greenAccounts || 0} green accounts
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ padding: '20px 20px 12px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Shield style={{ width: '16px', height: '16px', color: '#d97706' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#111827' }}>Risk Manager</h4>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>Fewest escalations</p>
          </div>
          <div style={{ padding: '0 20px 20px 20px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
              {data.sort((a, b) => a.metrics.escalations - b.metrics.escalations)[0]?.name || "—"}
            </div>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
              {data[0]?.metrics.escalations || 0} escalations
            </p>
          </div>
        </div>
      </div>

      {/* Full Rankings */}
      <div style={cardStyle}>
        <div style={{ padding: '24px 24px 16px 24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0', color: '#111827' }}>
            Weekly Rankings
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            Complete leaderboard for this week
          </p>
        </div>
        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.map((person, index) => (
              <div key={person.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#f9fafb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#6b7280',
                    width: '32px'
                  }}>
                    #{index + 1}
                  </span>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {person.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '500', margin: '0', color: '#111827' }}>
                      {person.name}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                      {person.email}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '500', margin: '0', color: '#111827' }}>
                    {person.metrics.score} pts
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                    {person.metrics.totalAccounts} accounts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}