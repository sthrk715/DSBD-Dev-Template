import type { DashboardDataService } from './interface'
import { MockDataService } from './mock-service'

export function getDataService(): DashboardDataService {
  // BigQuery接続が準備できたら環境変数で切替
  // if (process.env.DATA_SOURCE === 'bigquery') {
  //   return new BigQueryService()
  // }
  return new MockDataService()
}

export type { DashboardDataService } from './interface'
export type * from './types'
