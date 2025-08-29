#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import { IngestionService } from '../src/lib/ingestion/ingestion-service'
import { MockIngestionService } from '../src/lib/ingestion/mock-ingestion-service'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting data ingestion...')
  
  const useMockData = process.env.USE_MOCK_DATA === 'true' || 
                      !process.env.GOOGLE_SA_EMAIL || 
                      (!process.env.GOOGLE_SHEET_IDS && !process.env.GOOGLE_DRIVE_FOLDER_ID)
  
  if (useMockData) {
    console.log('Using mock data (no Google credentials configured or USE_MOCK_DATA=true)')
  } else {
    console.log('Using real Google Sheets data')
  }
  
  const service = useMockData 
    ? new MockIngestionService(prisma)
    : new IngestionService(prisma)
  
  try {
    const result = await service.runIngestion()
    
    console.log('Ingestion complete:')
    console.log(`- Success: ${result.success}`)
    console.log(`- Accounts processed: ${result.accountsProcessed}`)
    console.log(`- Actions processed: ${result.actionsProcessed}`)
    console.log(`- Touches processed: ${result.touchesProcessed}`)
    
    if (result.errors.length > 0) {
      console.error('Errors encountered:')
      result.errors.forEach(error => console.error(`  - ${error}`))
      process.exit(1)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
