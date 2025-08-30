# Forge OS - STO Account & Workflow Dashboard

Production web app for ingesting daily STO data and displaying account/workflow dashboards.

## Features

- **Dashboard**: Escalation queue, owner load distribution, paid accounts overview
- **Account Management**: Detailed account views with phases, metrics, and stakeholders
- **Action Tracking**: Kanban board for managing blockers and action items
- **Workflow Monitoring**: Track workflow progress and ownership
- **Leaderboard**: Gamified team performance metrics
- **Data Ingestion**: Automated Google Sheets integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth with magic links
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Hosting**: Render

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure database URL
3. Set up NextAuth secret
4. Add Google Service Account credentials
5. Configure admin emails

## Local Development

```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# Start development server
npm run dev

# Run data ingestion
npm run ingest:dev
```

## Deployment

### Render Setup

1. Create PostgreSQL database
2. Create Web Service from GitHub repo
3. Configure environment variables
4. Set build command: `npm install && npx prisma migrate deploy && npm run build`
5. Set start command: `npm start`

### Cron Job Setup

Create Render Cron Job for daily ingestion:
- Command: `npm run ingest`
- Schedule: `0 13 * * *` (6:30 AM PT)

## Data Ingestion

Supports two modes:
1. **Google Sheets**: Configure service account and sheet IDs
2. **Mock Data**: Automatically used when Google credentials not configured

## Access Control

- **Viewer**: Default role, read-only access
- **Admin**: Full access, configured via ADMIN_EMAILS environment variable

## Performance Targets

- Lighthouse Performance Score: ≥85
- First Contentful Paint: <2.5s
- Database queries optimized with proper indexes

## Support

For issues or questions, contact the development team.