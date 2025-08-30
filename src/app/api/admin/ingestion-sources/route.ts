import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateIngestionSourceSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  spreadsheetId: z.string().min(1, 'Spreadsheet ID is required'),
  tab: z.string().optional(),
  active: z.boolean().default(true)
})

export async function GET() {
  try {
    const session = await auth()
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sources = await prisma.ingestionSource.findMany({
      orderBy: { accountName: 'asc' }
    })

    return NextResponse.json(sources)
  } catch (error) {
    console.error('Failed to fetch ingestion sources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validated = CreateIngestionSourceSchema.parse(body)

    // Check if spreadsheet ID already exists
    const existing = await prisma.ingestionSource.findFirst({
      where: { spreadsheetId: validated.spreadsheetId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Spreadsheet ID already exists' },
        { status: 400 }
      )
    }

    const source = await prisma.ingestionSource.create({
      data: {
        accountName: validated.accountName,
        spreadsheetId: validated.spreadsheetId,
        tab: validated.tab || null,
        active: validated.active
      }
    })

    return NextResponse.json(source, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Failed to create ingestion source:', error)
    return NextResponse.json(
      { error: 'Failed to create source' },
      { status: 500 }
    )
  }
}
