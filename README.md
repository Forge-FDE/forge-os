# Forge OS

**STO Account and Workflow Dashboard**

A Next.js application for managing STO (Special Technical Operations) accounts, workflows, and data ingestion from Google Sheets.

## Features

- **Authentication**: Email-based authentication with NextAuth.js
- **Data Ingestion**: Automated import from Google Sheets with mock data fallback  
- **Escalation Scoring**: Smart algorithms to identify at-risk accounts
- **Admin Panel**: Manual ingestion triggers and source management
- **Dashboard**: Account overview, actions tracking, and touch point management

## Getting Started

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Data Ingestion

```bash
# Run ingestion with local environment
npm run ingest:dev

# Production ingestion  
npm run ingest
```

### Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/forge_os_dev
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
ADMIN_EMAILS=admin@forge-os.com
ETL_TOKEN=your-etl-token
USE_MOCK_DATA=true
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM  
- **Authentication**: NextAuth.js v5
- **UI**: Tailwind CSS + shadcn/ui
- **Data Sources**: Google Sheets API
- **Deployment**: Render

Built with ❤️ for efficient STO operations management.
