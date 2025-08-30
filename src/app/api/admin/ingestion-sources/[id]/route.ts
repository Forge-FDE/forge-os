import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateIngestionSourceSchema = z.object({
  accountName: z.string().min(1).optional(),
  spreadsheetId: z.string().min(1).optional(),
  tab: z.string().optional(),
  active: z.boolean().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validated = UpdateIngestionSourceSchema.parse(body)

    // Check if the source exists
    const existing = await prisma.ingestionSource.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Ingestion source not found' },
        { status: 404 }
      )
    }

    // If updating spreadsheetId, check for duplicates
    if (validated.spreadsheetId && validated.spreadsheetId !== existing.spreadsheetId) {
      const duplicate = await prisma.ingestionSource.findFirst({
        where: { 
          spreadsheetId: validated.spreadsheetId,
          id: { not: id }
        }
      })

      if (duplicate) {
        return NextResponse.json(
          { error: 'Spreadsheet ID already exists' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.ingestionSource.update({
      where: { id },
      data: validated
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Failed to update ingestion source:', error)
    return NextResponse.json(
      { error: 'Failed to update source' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if the source exists
    const existing = await prisma.ingestionSource.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Ingestion source not found' },
        { status: 404 }
      )
    }

    await prisma.ingestionSource.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete ingestion source:', error)
    return NextResponse.json(
      { error: 'Failed to delete source' },
      { status: 500 }
    )
  }
}
