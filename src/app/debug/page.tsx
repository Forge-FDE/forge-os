import { prisma } from "@/lib/prisma"

export default async function DebugPage() {
  try {
    // Test basic database connection
    const accountCount = await prisma.account.count()
    const userCount = await prisma.user.count()
    
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Debug Info</h1>
        <p>✅ Database connection working</p>
        <p>Accounts: {accountCount}</p>
        <p>Users: {userCount}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    )
  } catch (error) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Debug Info</h1>
        <p>❌ Database connection failed</p>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <p>Timestamp: {new Date().toISOString()}</p>
      </div>
    )
  }
}
