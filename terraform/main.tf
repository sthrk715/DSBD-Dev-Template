terraform {
  required_version = ">= 1.9.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
  }

  # [TODO: GCSバックエンド設定]
  # backend "gcs" {
  #   bucket = "dsbd-terraform-state"
  #   prefix = "terraform/state"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ===== Networking =====
module "networking" {
  source     = "./modules/networking"
  project_id = var.project_id
  region     = var.region
  env        = var.env
}

# ===== IAM =====
module "iam" {
  source     = "./modules/iam"
  project_id = var.project_id
  env        = var.env
}

# ===== Cloud SQL (PostgreSQL) =====
module "cloud_sql" {
  source     = "./modules/cloud-sql"
  project_id = var.project_id
  region     = var.region
  env        = var.env
  network_id = module.networking.vpc_id
}

# ===== BigQuery =====
module "bigquery" {
  source     = "./modules/bigquery"
  project_id = var.project_id
  region     = var.region
  env        = var.env
}

# ===== Cloud Run =====
module "cloud_run" {
  source              = "./modules/cloud-run"
  project_id          = var.project_id
  region              = var.region
  env                 = var.env
  service_account     = module.iam.cloud_run_sa_email
  cloud_sql_instance  = module.cloud_sql.connection_name
  vpc_connector       = module.networking.vpc_connector_id
}
