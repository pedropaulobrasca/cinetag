# ---------- IAM Role para App Runner acessar ECR ----------

resource "aws_iam_role" "apprunner_ecr" {
  name = "${var.project_name}-apprunner-ecr"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "build.apprunner.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Project = var.project_name
  }
}

resource "aws_iam_role_policy_attachment" "apprunner_ecr" {
  role       = aws_iam_role.apprunner_ecr.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSAppRunnerServicePolicyForECRAccess"
}

# ---------- App Runner Service (Backend) ----------

resource "aws_apprunner_service" "backend" {
  service_name = "${var.project_name}-backend"

  source_configuration {
    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner_ecr.arn
    }

    image_repository {
      image_configuration {
        port = "3333"

        runtime_environment_variables = {
          PORT           = "3333"
          MONGODB_URI    = var.mongodb_uri
          JWT_SECRET     = var.jwt_secret
          JWT_EXPIRES_IN = var.jwt_expires_in
        }
      }

      image_identifier      = "${aws_ecr_repository.backend.repository_url}:latest"
      image_repository_type = "ECR"
    }

    auto_deployments_enabled = true
  }

  instance_configuration {
    cpu    = "1024"  # 1 vCPU
    memory = "2048"  # 2 GB
  }

  health_check_configuration {
    protocol            = "HTTP"
    path                = "/health"
    interval            = 10
    timeout             = 5
    healthy_threshold   = 1
    unhealthy_threshold = 5
  }

  tags = {
    Project = var.project_name
  }
}
