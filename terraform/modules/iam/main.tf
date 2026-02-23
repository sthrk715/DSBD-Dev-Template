variable "project_id" { type = string }
variable "env" { type = string }

# Cloud Run用サービスアカウント
resource "google_service_account" "cloud_run" {
  account_id   = "dsbd-run-${var.env}"
  display_name = "DSBD Cloud Run SA (${var.env})"
}

# Cloud Run → BigQuery 読み取り
resource "google_project_iam_member" "bigquery_reader" {
  project = var.project_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "bigquery_job" {
  project = var.project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run → Cloud SQL 接続
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run → Secret Manager 読み取り
resource "google_project_iam_member" "secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run → Cloud Logging 書き込み
resource "google_project_iam_member" "log_writer" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# Cloud Run → Cloud Trace 書き込み
resource "google_project_iam_member" "trace_agent" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

output "cloud_run_sa_email" {
  value = google_service_account.cloud_run.email
}
