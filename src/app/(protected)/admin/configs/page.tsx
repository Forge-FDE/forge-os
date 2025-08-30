import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { GoogleSheetsConfig } from "@/components/admin/configs/google-sheets-config"
import { SystemConfig } from "@/components/admin/configs/system-config"

export default async function AdminConfigsPage() {
  const session = await auth()
  
  if (session?.user?.role !== "admin") {
    redirect("/")
  }
  
  const sources = await prisma.ingestionSource.findMany({
    orderBy: { accountName: 'asc' },
  })
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',
      padding: '24px'
    }}>
      {/* Header */}
      <div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#111827',
          margin: '0 0 8px 0'
        }}>
          System Configuration
        </h1>
        <p style={{ 
          color: '#6b7280',
          fontSize: '16px',
          margin: '0'
        }}>
          Manage data sources, integrations, and system settings
        </p>
      </div>

      {/* Configuration Sections */}
      <div style={{ 
        display: 'grid', 
        gap: '24px',
        gridTemplateColumns: '1fr',
        maxWidth: '1200px'
      }}>
        <GoogleSheetsConfig sources={sources} />
        <SystemConfig />
      </div>
    </div>
  )
}
