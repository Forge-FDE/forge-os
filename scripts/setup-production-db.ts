#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function setupProductionDatabase() {
  console.log('🔧 Setting up production database...')
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check if User table exists (NextAuth requirement)
    console.log('🔍 Checking database tables...')
    const userCount = await prisma.user.count().catch(() => null)
    
    if (userCount === null) {
      console.log('❌ Database tables missing - run `prisma db push` first')
      console.log('💡 In Render Shell, run: npx prisma db push')
      process.exit(1)
    }
    
    console.log(`📊 Found ${userCount} users in database`)
    
    // Check if seed users exist
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@forge-os.com' }
    })
    
    if (!adminUser) {
      console.log('🌱 Creating seed users...')
      await prisma.user.createMany({
        data: [
          {
            email: 'admin@forge-os.com',
            name: 'Admin User',
            role: 'admin'
          },
          {
            email: 'sto@forge-os.com', 
            name: 'STO User',
            role: 'viewer'
          }
        ]
      })
      console.log('✅ Seed users created')
    } else {
      console.log('✅ Seed users already exist')
    }
    
    // Check account count
    const accountCount = await prisma.account.count()
    console.log(`📈 Found ${accountCount} accounts`)
    
    if (accountCount === 0) {
      console.log('💡 No accounts found - run ingestion to populate data')
      console.log('📖 Visit /admin and click "Run Ingestion Now"')
    }
    
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupProductionDatabase()
