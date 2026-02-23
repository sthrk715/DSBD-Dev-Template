variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }

resource "google_bigquery_dataset" "main" {
  dataset_id  = "dsbd_${var.env}"
  location    = var.region
  description = "DSBD Dashboard dataset (${var.env})"

  default_table_expiration_ms = var.env == "dev" ? 2592000000 : null # dev: 30日

  labels = {
    env     = var.env
    project = "dsbd"
  }
}

# [TODO: テーブル定義は docs/02_design/bigquery-schema.md に基づいて追加]
# resource "google_bigquery_table" "example" {
#   dataset_id = google_bigquery_dataset.main.dataset_id
#   table_id   = "example_table"
#   schema     = file("${path.module}/schemas/example.json")
# }

output "dataset_id" {
  value = google_bigquery_dataset.main.dataset_id
}
