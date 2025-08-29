import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
        USE_MOCK_DATA: process.env.USE_MOCK_DATA,
        ADMIN_EMAILS: process.env.ADMIN_EMAILS,
      },
      session: session ? {
        user: session.user,
        authenticated: true
      } : {
        authenticated: false
      },
      status: 'OK'
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'ERROR'
    }, { status: 500 })
  }
}
