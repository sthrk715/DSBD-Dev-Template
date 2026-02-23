variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }
variable "service_account" { type = string }
variable "cloud_sql_instance" { type = string }
variable "vpc_connector" { type = string }

resource "google_cloud_run_v2_service" "app" {
  name     = "dsbd-web-${var.env}"
  location = var.region

  template {
    service_account = var.service_account

    scaling {
      min_instance_count = var.env == "prod" ? 1 : 0
      max_instance_count = var.env == "prod" ? 10 : 3
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/dsbd-app/dsbd-web:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = var.env == "prod" ? "2" : "1"
          memory = var.env == "prod" ? "1Gi" : "512Mi"
        }
      }

      startup_probe {
        http_get {
          path = "/api/health"
        }
        initial_delay_seconds = 5
        period_seconds        = 10
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/api/health"
        }
        period_seconds = 30
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [var.cloud_sql_instance]
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Artifact Registry
resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = "dsbd-app"
  format        = "DOCKER"
}

output "service_url" {
  value = google_cloud_run_v2_service.app.uri
}
