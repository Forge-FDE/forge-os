import { PrismaClient } from '@prisma/client'
import { IngestionResult } from '@/types/ingestion'
import { generateMockSheetData } from './mock-data'
import { calculateEscalationScore, parsePhase, parseBoolean, parseNumber, parseDate } from '@/lib/utils/escalation'
import { differenceInDays } from 'date-fns'

export class MockIngestionService {
  private prisma: PrismaClient
  private mockAccounts = ['SoFi', 'Jefferies', 'KeyBank', 'Coinbase', 'Wells Fargo', 'Chase']
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
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
      for (const accountName of this.mockAccounts) {
        const mockData = generateMockSheetData(accountName)
        await this.processMockData(accountName, mockData, result)
      }
      
      result.success = true
    } catch (error) {
      result.errors.push(`Mock ingestion error: ${error}`)
    }
    
    return result
  }
  
  private async processMockData(
    accountName: string,
    data: ReturnType<typeof generateMockSheetData>,
    result: IngestionResult
  ): Promise<void> {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || []
    
    // Upsert STO user
    const stoUser = await this.prisma.user.upsert({
      where: { email: data.rollup.sto },
      update: {
        name: data.rollup.sto.split('@')[0],
      },
      create: {
        email: data.rollup.sto,
        name: data.rollup.sto.split('@')[0],
        role: adminEmails.includes(data.rollup.sto) ? 'admin' : 'viewer',
      },
    })
    
    // Parse phase
    const phase = parsePhase(data.rollup.phase)
    
    // Calculate derived fields
    const dsltDays = parseNumber(data.rollup.dsltDays)
    const blockersOpen = parseNumber(data.rollup.blockersOpen)
    const oldestBlockerAgeD = parseNumber(data.rollup.oldestBlockerAgeD)
    const qcPct7d = parseNumber(data.rollup.qcPct7d)
    const automation7d = parseNumber(data.rollup.automation7d)
    const sentiment = data.rollup.sentiment || null
    
    const { score, state } = calculateEscalationScore({
      phase,
      sentiment,
      dsltDays,
      blockersOpen,
      qcPct7d,
      automation7d,
    })
    
    // Calculate GM
    const revenue7d = parseNumber(data.rollup.revenue7d)
    const cost7d = parseNumber(data.rollup.cost7d)
    const gm7d = revenue7d > 0 ? (revenue7d - cost7d) / revenue7d : 0
    
    // Upsert Account
    const account = await this.prisma.account.upsert({
      where: { name: accountName },
      update: {
        phase,
        stoId: stoUser.id,
        sponsor: data.rollup.sponsor || null,
        champion: data.rollup.champion || null,
        nextGateDue: parseDate(data.rollup.nextGateDue),
        dsltDays,
        sentiment,
        volume7d: parseNumber(data.rollup.volume7d),
        revenue7d,
        cost7d,
        gm7d,
        qcPct7d,
        aht7d: parseNumber(data.rollup.aht7d),
        p95ms7d: parseNumber(data.rollup.p95ms7d),
        automation7d,
        blockersOpen,
        oldestBlockerAgeD,
        escalationScore: score,
        escalationState: state,
        notes: data.rollup.notes || null,
      },
      create: {
        name: accountName,
        phase,
        stoId: stoUser.id,
        sponsor: data.rollup.sponsor || null,
        champion: data.rollup.champion || null,
        nextGateDue: parseDate(data.rollup.nextGateDue),
        dsltDays,
        sentiment,
        volume7d: parseNumber(data.rollup.volume7d),
        revenue7d,
        cost7d,
        gm7d,
        qcPct7d,
        aht7d: parseNumber(data.rollup.aht7d),
        p95ms7d: parseNumber(data.rollup.p95ms7d),
        automation7d,
        blockersOpen,
        oldestBlockerAgeD,
        escalationScore: score,
        escalationState: state,
        notes: data.rollup.notes || null,
      },
    })
    
    result.accountsProcessed++
    
    // Upsert default "all" workflow
    await this.prisma.workflow.upsert({
      where: {
        accountId_name: {
          accountId: account.id,
          name: data.rollup.workflow || '— all —',
        },
      },
      update: {
        phase,
        golden10: parseBoolean(data.rollup.golden10),
        accessReady: parseBoolean(data.rollup.accessReady),
        volume7d: parseNumber(data.rollup.volume7d),
        qcPct7d,
        aht7d: parseNumber(data.rollup.aht7d),
        p95ms7d: parseNumber(data.rollup.p95ms7d),
        automation7d,
        budgetUtil7d: parseNumber(data.rollup.budgetUtil7d),
        nextMilestone: data.rollup.nextMilestone || null,
        wgSentiment: data.rollup.wgSentiment || null,
      },
      create: {
        accountId: account.id,
        name: data.rollup.workflow || '— all —',
        phase,
        golden10: parseBoolean(data.rollup.golden10),
        accessReady: parseBoolean(data.rollup.accessReady),
        volume7d: parseNumber(data.rollup.volume7d),
        qcPct7d,
        aht7d: parseNumber(data.rollup.aht7d),
        p95ms7d: parseNumber(data.rollup.p95ms7d),
        automation7d,
        budgetUtil7d: parseNumber(data.rollup.budgetUtil7d),
        nextMilestone: data.rollup.nextMilestone || null,
        wgSentiment: data.rollup.wgSentiment || null,
      },
    })
    
    // Process Actions
    for (const actionRow of data.actions) {
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
    for (const touchRow of data.touches) {
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
}
