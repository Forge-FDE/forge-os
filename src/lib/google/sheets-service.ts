import { google } from 'googleapis'
import { SheetRow, ActionRow, TouchRow } from '@/types/ingestion'

export class GoogleSheetsService {
  private sheets
  private drive
  
  constructor() {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SA_EMAIL,
      key: process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
      ],
    })
    
    this.sheets = google.sheets({ version: 'v4', auth })
    this.drive = google.drive({ version: 'v3', auth })
  }
  
  async getSpreadsheetIds(): Promise<string[]> {
    // Option 1: Use specific sheet IDs from environment
    if (process.env.GOOGLE_SHEET_IDS) {
      return process.env.GOOGLE_SHEET_IDS.split(',').map(id => id.trim())
    }
    
    // Option 2: Get all sheets from a folder
    if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
      try {
        const response = await this.drive.files.list({
          q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.spreadsheet'`,
          fields: 'files(id, name)',
        })
        
        return response.data.files?.map(file => file.id!).filter(Boolean) || []
      } catch (error) {
        console.error('Error fetching sheets from folder:', error)
        return []
      }
    }
    
    return []
  }
  
  async getSheetData(spreadsheetId: string): Promise<{
    rollup: SheetRow | null
    actions: ActionRow[]
    touches: TouchRow[]
    sheetName: string
  }> {
    try {
      // Get spreadsheet metadata
      const metadata = await this.sheets.spreadsheets.get({
        spreadsheetId,
      })
      
      const sheetName = metadata.data.properties?.title || 'Unknown'
      
      // Get rollup data from A3:AB3
      const rollupResponse = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A3:AB3',
      })
      
      const rollupValues = rollupResponse.data.values?.[0] || []
      const rollup: SheetRow | null = rollupValues.length > 0 ? {
        account: rollupValues[0] || '',
        workflow: rollupValues[1] || '— all —',
        phase: rollupValues[2] || '0',
        sto: rollupValues[3] || '',
        sponsor: rollupValues[4] || '',
        champion: rollupValues[5] || '',
        golden10: rollupValues[6] || 'false',
        accessReady: rollupValues[7] || 'false',
        volume7d: rollupValues[8] || '0',
        revenue7d: rollupValues[9] || '0',
        cost7d: rollupValues[10] || '0',
        qcPct7d: rollupValues[11] || '0',
        aht7d: rollupValues[12] || '0',
        p95ms7d: rollupValues[13] || '0',
        automation7d: rollupValues[14] || '0',
        budgetUtil7d: rollupValues[15] || '0',
        dsltDays: rollupValues[16] || '0',
        blockersOpen: rollupValues[17] || '0',
        oldestBlockerAgeD: rollupValues[18] || '0',
        sentiment: rollupValues[19] || '',
        notes: rollupValues[20] || '',
        nextGateDue: rollupValues[21] || '',
        nextMilestone: rollupValues[22] || '',
        wgSentiment: rollupValues[23] || '',
      } : null
      
      // Find and parse Actions table
      const actions = await this.getActionsFromSheet(spreadsheetId)
      
      // Find and parse Touches table
      const touches = await this.getTouchesFromSheet(spreadsheetId)
      
      return {
        rollup,
        actions,
        touches,
        sheetName,
      }
    } catch (error) {
      console.error(`Error reading sheet ${spreadsheetId}:`, error)
      return {
        rollup: null,
        actions: [],
        touches: [],
        sheetName: 'Unknown',
      }
    }
  }
  
  private async getActionsFromSheet(spreadsheetId: string): Promise<ActionRow[]> {
    try {
      // Get a larger range to find the Actions table
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A:K', // Assuming actions are in these columns
      })
      
      const values = response.data.values || []
      const actions: ActionRow[] = []
      
      // Find the "Actions / Blockers" header
      let headerRowIndex = -1
      for (let i = 0; i < values.length; i++) {
        if (values[i].some(cell => cell?.toString().includes('Actions') || cell?.toString().includes('Blockers'))) {
          headerRowIndex = i
          break
        }
      }
      
      if (headerRowIndex === -1) return actions
      
      // Parse action rows (skip header)
      for (let i = headerRowIndex + 1; i < values.length; i++) {
        const row = values[i]
        if (!row || row.length === 0 || !row[0]) continue // Skip empty rows
        
        actions.push({
          title: row[0] || '',
          severity: row[1] || 'sev-2',
          status: row[2] || 'open',
          responsible: row[3] || '',
          dueDate: row[4] || undefined,
          openedAt: row[5] || undefined,
          slackLink: row[6] || undefined,
          docLink: row[7] || undefined,
        })
      }
      
      return actions
    } catch (error) {
      console.error('Error parsing actions:', error)
      return []
    }
  }
  
  private async getTouchesFromSheet(spreadsheetId: string): Promise<TouchRow[]> {
    try {
      // Get a larger range to find the Touches table
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'M:Q', // Assuming touches are in these columns
      })
      
      const values = response.data.values || []
      const touches: TouchRow[] = []
      
      // Find the "Touches" header
      let headerRowIndex = -1
      for (let i = 0; i < values.length; i++) {
        if (values[i].some(cell => cell?.toString().toLowerCase().includes('touch'))) {
          headerRowIndex = i
          break
        }
      }
      
      if (headerRowIndex === -1) return touches
      
      // Parse touch rows (skip header)
      for (let i = headerRowIndex + 1; i < values.length; i++) {
        const row = values[i]
        if (!row || row.length === 0 || !row[0]) continue // Skip empty rows
        
        touches.push({
          touchedAt: row[0] || new Date().toISOString(),
          actor: row[1] || '',
          channel: row[2] || 'email',
          summary: row[3] || undefined,
        })
      }
      
      return touches
    } catch (error) {
      console.error('Error parsing touches:', error)
      return []
    }
  }
}
