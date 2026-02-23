import { BigQuery } from '@google-cloud/bigquery'

let bigqueryClient: BigQuery | null = null

export function getBigQueryClient(): BigQuery {
  if (!bigqueryClient) {
    bigqueryClient = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
    })
  }
  return bigqueryClient
}

/**
 * BigQueryクエリを実行
 * ※ パラメータ化クエリのみ許可（SQLインジェクション防止）
 */
export async function executeQuery<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T[]> {
  const client = getBigQueryClient()
  const [rows] = await client.query({
    query,
    params,
    location: process.env.GCP_REGION ?? 'asia-northeast1',
  })
  return rows as T[]
}
