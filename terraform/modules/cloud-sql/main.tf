variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "network_id" { type = string }

resource "google_sql_database_instance" "main" {
  name             = "dsbd-postgres-${var.env}"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.env == "prod" ? "db-custom-2-8192" : "db-f1-micro"
    availability_type = var.env == "prod" ? "REGIONAL" : "ZONAL"
    disk_size         = var.env == "prod" ? 50 : 10
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.env == "prod"
      start_time                     = "03:00"
      backup_retention_settings {
        retained_backups = var.env == "prod" ? 30 : 7
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = var.network_id
    }

    database_flags {
      name  = "max_connections"
      value = var.env == "prod" ? "200" : "50"
    }

    maintenance_window {
      day          = 7 # Sunday
      hour         = 3
      update_track = "stable"
    }
  }

  deletion_protection = var.env == "prod"
}

resource "google_sql_database" "app" {
  name     = "dsbd"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "app" {
  name     = "dsbd-app"
  instance = google_sql_database_instance.main.name
  password = random_password.db_password.result
}

resource "random_password" "db_password" {
  length  = 32
  special = true
}

# Secret Managerにパスワード格納
resource "google_secret_manager_secret" "db_password" {
  secret_id = "dsbd-db-password-${var.env}"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = random_password.db_password.result
}

output "connection_name" {
  value = google_sql_database_instance.main.connection_name
}
