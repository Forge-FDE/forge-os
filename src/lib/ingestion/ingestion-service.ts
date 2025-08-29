import { PrismaClient } from '@prisma/client'
import { GoogleSheetsService } from '@/lib/google/sheets-service'
import { calculateEscalationScore, parsePhase, parseBoolean, parseNumber, parseDate } from '@/lib/utils/escalation'
import { IngestionResult } from '@/types/ingestion'
import { differenceInDays } from 'date-fns'

export class IngestionService {
  private prisma: PrismaClient
  private sheetsService: GoogleSheetsService
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
    this.sheetsService = new GoogleSheetsService()
  }
  
  async runIngestion(): Promise<IngestionResult> {
    const result: IngestionResult = {
      success: false,
      accountsProcessed: 0,
      actionsProcessed: 0,
      touchesProcessed: 0,
      errors: [],
      timestamp: new Date(),
    }
    
    try {
      const spreadsheetIds = await this.sheetsService.getSpreadsheetIds()
      
      if (spreadsheetIds.length === 0) {
        result.errors.push('No spreadsheet IDs configured')
        return result
      }
      
      for (const spreadsheetId of spreadsheetIds) {
        try {
          await this.processSpreadsheet(spreadsheetId, result)
        } catch (error) {
          result.errors.push(`Error processing ${spreadsheetId}: ${error}`)
        }
      }
      
      result.success = result.errors.length === 0
      
      // Update ingestion source records
      await this.updateIngestionSources(result)
      
    } catch (error) {
      result.errors.push(`Fatal error: ${error}`)
    }
    
    return result
  }
  
  private async processSpreadsheet(
    spreadsheetId: string,
    result: IngestionResult
  ): Promise<void> {
    const sheetData = await this.sheetsService.getSheetData(spreadsheetId)
    
    if (!sheetData.rollup) {
      result.errors.push(`No rollup data found in ${spreadsheetId}`)
      return
    }
    
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    
    // Upsert STO user
    const stoUser = await this.prisma.user.upsert({
      where: { email: sheetData.rollup.sto },
      update: {
        name: sheetData.rollup.sto.split('@')[0],
      },
      create: {
        email: sheetData.rollup.sto,
        name: sheetData.rollup.sto.split('@')[0],
        role: adminEmails.includes(sheetData.rollup.sto) ? 'admin' : 'viewer',
      },
    })
    
    // Parse phase
    const phase = parsePhase(sheetData.rollup.phase)
    
    // Calculate derived fields
    const dsltDays = parseNumber(sheetData.rollup.dsltDays)
    const blockersOpen = parseNumber(sheetData.rollup.blockersOpen)
    const oldestBlockerAgeD = parseNumber(sheetData.rollup.oldestBlockerAgeD)
    const qcPct7d = parseNumber(sheetData.rollup.qcPct7d)
    const automation7d = parseNumber(sheetData.rollup.automation7d)
    const sentiment = sheetData.rollup.sentiment || null
    
    const { score, state } = calculateEscalationScore({
      phase,
      sentiment,
      dsltDays,
      blockersOpen,
      qcPct7d,
      automation7d,
    })
    
    // Calculate GM
    const revenue7d = parseNumber(sheetData.rollup.revenue7d)
    const cost7d = parseNumber(sheetData.rollup.cost7d)
    const gm7d = revenue7d > 0 ? (revenue7d - cost7d) / revenue7d : 0
    
    // Upsert Account
    const account = await this.prisma.account.upsert({
      where: { name: sheetData.rollup.account },
      update: {
        phase,
        stoId: stoUser.id,
        sponsor: sheetData.rollup.sponsor || null,
        champion: sheetData.rollup.champion || null,
        nextGateDue: parseDate(sheetData.rollup.nextGateDue),
        dsltDays,
        sentiment,
        volume7d: parseNumber(sheetData.rollup.volume7d),
        revenue7d,
        cost7d,
        gm7d,
        qcPct7d,
        aht7d: parseNumber(sheetData.rollup.aht7d),
        p95ms7d: parseNumber(sheetData.rollup.p95ms7d),
        automation7d,
        blockersOpen,
        oldestBlockerAgeD,
        escalationScore: score,
        escalationState: state,
        notes: sheetData.rollup.notes || null,
      },
      create: {
        name: sheetData.rollup.account,
        phase,
        stoId: stoUser.id,
        sponsor: sheetData.rollup.sponsor || null,
        champion: sheetData.rollup.champion || null,
        nextGateDue: parseDate(sheetData.rollup.nextGateDue),
        dsltDays,
        sentiment,
        volume7d: parseNumber(sheetData.rollup.volume7d),
        revenue7d,
        cost7d,
        gm7d,
        qcPct7d,
        aht7d: parseNumber(sheetData.rollup.aht7d),
        p95ms7d: parseNumber(sheetData.rollup.p95ms7d),
        automation7d,
        blockersOpen,
        oldestBlockerAgeD,
        escalationScore: score,
        escalationState: state,
        notes: sheetData.rollup.notes || null,
      },
    })
    
    result.accountsProcessed++
    
    // Upsert default "all" workflow
    await this.prisma.workflow.upsert({
      where: {
        accountId_name: {
          accountId: account.id,
          name: sheetData.rollup.workflow || '— all —',
        },
      },
      update: {
        phase,
        golden10: parseBoolean(sheetData.rollup.golden10),
        accessReady: parseBoolean(sheetData.rollup.accessReady),
        volume7d: parseNumber(sheetData.rollup.volume7d),
        qcPct7d,
        aht7d: parseNumber(sheetData.rollup.aht7d),
        p95ms7d: parseNumber(sheetData.rollup.p95ms7d),
        automation7d,
        budgetUtil7d: parseNumber(sheetData.rollup.budgetUtil7d),
        nextMilestone: sheetData.rollup.nextMilestone || null,
        wgSentiment: sheetData.rollup.wgSentiment || null,
      },
      create: {
        accountId: account.id,
        name: sheetData.rollup.workflow || '— all —',
        phase,
        golden10: parseBoolean(sheetData.rollup.golden10),
        accessReady: parseBoolean(sheetData.rollup.accessReady),
        volume7d: parseNumber(sheetData.rollup.volume7d),
        qcPct7d,
        aht7d: parseNumber(sheetData.rollup.aht7d),
        p95ms7d: parseNumber(sheetData.rollup.p95ms7d),
        automation7d,
        budgetUtil7d: parseNumber(sheetData.rollup.budgetUtil7d),
        nextMilestone: sheetData.rollup.nextMilestone || null,
        wgSentiment: sheetData.rollup.wgSentiment || null,
      },
    })
    
    // Process Actions
    for (const actionRow of sheetData.actions) {
      const openedAt = parseDate(actionRow.openedAt) || new Date()
      const ageD = differenceInDays(new Date(), openedAt)
      
      await this.prisma.action.upsert({
        where: {
          accountId_title_openedAt: {
            accountId: account.id,
            title: actionRow.title,
            openedAt,
          },
        },
        update: {
          severity: actionRow.severity,
          status: actionRow.status,
          responsible: actionRow.responsible,
          dueDate: parseDate(actionRow.dueDate),
          lastUpdate: new Date(),
          slackLink: actionRow.slackLink || null,
          docLink: actionRow.docLink || null,
          ageD,
        },
        create: {
          accountId: account.id,
          title: actionRow.title,
          severity: actionRow.severity,
          status: actionRow.status,
          responsible: actionRow.responsible,
          dueDate: parseDate(actionRow.dueDate),
          openedAt,
          slackLink: actionRow.slackLink || null,
          docLink: actionRow.docLink || null,
          ageD,
        },
      })
      
      result.actionsProcessed++
    }
    
    // Process Touches
    for (const touchRow of sheetData.touches) {
      const touchedAt = parseDate(touchRow.touchedAt) || new Date()
      
      await this.prisma.touch.upsert({
        where: {
          accountId_touchedAt_actor_channel: {
            accountId: account.id,
            touchedAt,
            actor: touchRow.actor,
            channel: touchRow.channel,
          },
        },
        update: {
          summary: touchRow.summary || null,
        },
        create: {
          accountId: account.id,
          touchedAt,
          actor: touchRow.actor,
          channel: touchRow.channel,
          summary: touchRow.summary || null,
        },
      })
      
      result.touchesProcessed++
    }
    
    // Update DSLT based on latest touch/action
    const lastTouch = await this.prisma.touch.findFirst({
      where: { accountId: account.id },
      orderBy: { touchedAt: 'desc' },
    })
    
    const lastAction = await this.prisma.action.findFirst({
      where: { accountId: account.id },
      orderBy: { lastUpdate: 'desc' },
    })
    
    let lastActivity = null
    if (lastTouch && lastAction) {
      lastActivity = lastTouch.touchedAt > lastAction.lastUpdate 
        ? lastTouch.touchedAt 
        : lastAction.lastUpdate
    } else if (lastTouch) {
      lastActivity = lastTouch.touchedAt
    } else if (lastAction) {
      lastActivity = lastAction.lastUpdate
    }
    
    if (lastActivity) {
      const newDsltDays = differenceInDays(new Date(), lastActivity)
      await this.prisma.account.update({
        where: { id: account.id },
        data: { dsltDays: newDsltDays },
      })
    }
  }
  
  private async updateIngestionSources(result: IngestionResult): Promise<void> {
    const spreadsheetIds = await this.sheetsService.getSpreadsheetIds()
    
    for (const spreadsheetId of spreadsheetIds) {
      await this.prisma.ingestionSource.upsert({
        where: { spreadsheetId },
        update: {
          lastRunAt: result.timestamp,
          lastStatus: result.success ? 'success' : 'failed',
        },
        create: {
          accountName: 'Unknown',
          spreadsheetId,
          active: true,
          lastRunAt: result.timestamp,
          lastStatus: result.success ? 'success' : 'failed',
        },
      })
    }
  }
}
