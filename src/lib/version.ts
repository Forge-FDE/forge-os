export const APP_VERSION = '0.2.0'

export const VERSION_HISTORY = {
  '0.1.0': {
    date: '2024-01-15',
    description: 'Original MVP with escalation queue dashboard',
    features: [
      'Escalation queue',
      'Owner load charts',
      'Paid accounts table',
      'Basic auth system',
      'Google Sheets integration'
    ]
  },
  '0.2.0': {
    date: '2024-01-16',
    description: 'Dashboard redesign with use cases and timeline',
    features: [
      'Use cases pre/post deployment views',
      'Sentiment scatter plot',
      'Timeline gantt chart',
      'Advanced filtering'
    ]
  }
}

export interface VersionInfo {
  date: string
  description: string
  features: string[]
}

export function getCurrentVersion(): string {
  return APP_VERSION
}

export function getVersionHistory(): Record<string, VersionInfo> {
  return VERSION_HISTORY
}

export function getLatestFeatures(): string[] {
  return VERSION_HISTORY[APP_VERSION]?.features || []
}
