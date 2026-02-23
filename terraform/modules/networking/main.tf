variable "project_id" { type = string }
variable "region" { type = string }
variable "env" { type = string }

# VPCネットワーク
resource "google_compute_network" "main" {
  name                    = "dsbd-vpc-${var.env}"
  auto_create_subnetworks = false
}

# サブネット
resource "google_compute_subnetwork" "main" {
  name          = "dsbd-subnet-${var.env}"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.main.id

  private_ip_google_access = true
}

# VPCコネクタ（Cloud Run → Cloud SQL接続用）
resource "google_vpc_access_connector" "main" {
  name   = "dsbd-connector-${var.env}"
  region = var.region

  subnet {
    name = google_compute_subnetwork.main.name
  }

  min_instances = 2
  max_instances = var.env == "prod" ? 10 : 3
}

# Cloud SQLプライベートIP用
resource "google_compute_global_address" "private_ip" {
  name          = "dsbd-private-ip-${var.env}"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.main.id
}

resource "google_service_networking_connection" "private_vpc" {
  network                 = google_compute_network.main.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip.name]
}

output "vpc_id" {
  value = google_compute_network.main.id
}

output "vpc_connector_id" {
  value = google_vpc_access_connector.main.id
}
