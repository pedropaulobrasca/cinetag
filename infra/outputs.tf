output "frontend_bucket" {
  description = "S3 bucket name for frontend static files"
  value       = aws_s3_bucket.frontend.id
}

output "frontend_url" {
  description = "CloudFront URL (frontend)"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "ecr_repository_url" {
  description = "ECR repository URL for backend Docker image"
  value       = aws_ecr_repository.backend.repository_url
}

output "backend_url" {
  description = "App Runner URL (backend API)"
  value       = "https://${aws_apprunner_service.backend.service_url}"
}
