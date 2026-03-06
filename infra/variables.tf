variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "cinetag"
}

variable "mongodb_uri" {
  description = "MongoDB Atlas connection URI"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "jwt_expires_in" {
  description = "JWT token expiration"
  type        = string
  default     = "7d"
}
