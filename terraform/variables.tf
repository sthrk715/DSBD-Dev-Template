variable "project_id" {
  description = "GCPプロジェクトID"
  type        = string
}

variable "region" {
  description = "GCPリージョン"
  type        = string
  default     = "asia-northeast1"
}

variable "env" {
  description = "環境名 (dev / stg / prod)"
  type        = string
  validation {
    condition     = contains(["dev", "stg", "prod"], var.env)
    error_message = "env must be one of: dev, stg, prod"
  }
}
