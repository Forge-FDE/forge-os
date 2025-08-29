import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { IngestionService } from '@/lib/ingestion/ingestion-service'
import { MockIngestionService } from '@/lib/ingestion/mock-ingestion-service'

export async function POST(request: NextRequest) {
  // Check for ETL token
  const token = request.headers.get('x-etl-token')
  
  if (token !== process.env.ETL_TOKEN) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  try {
    const useMockData = process.env.USE_MOCK_DATA === 'true' || 
                        !process.env.GOOGLE_SA_EMAIL || 
                        (!process.env.GOOGLE_SHEET_IDS && !process.env.GOOGLE_DRIVE_FOLDER_ID)
    
    const ingestionService = useMockData 
      ? new MockIngestionService(prisma)
      : new IngestionService(prisma)
    
    const result = await ingestionService.runIngestion()
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500 
    })
  } catch (error) {
    console.error('Ingestion error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with x-etl-token header.' },
    { status: 405 }
  )
}
