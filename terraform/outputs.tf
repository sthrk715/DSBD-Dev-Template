output "cloud_run_url" {
  description = "Cloud RunサービスURL"
  value       = module.cloud_run.service_url
}

output "cloud_sql_connection" {
  description = "Cloud SQL接続名"
  value       = module.cloud_sql.connection_name
}

output "bigquery_dataset" {
  description = "BigQueryデータセットID"
  value       = module.bigquery.dataset_id
}
