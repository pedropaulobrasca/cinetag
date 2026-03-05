#!/bin/bash
set -e

REGION="${AWS_REGION:-us-east-1}"

echo "=== CineTag Deploy ==="
echo ""

# 1. Terraform
echo "[1/4] Provisionando infraestrutura com Terraform..."
cd infra
terraform init -input=false
terraform apply -auto-approve
FRONTEND_BUCKET=$(terraform output -raw frontend_bucket)
FRONTEND_URL=$(terraform output -raw frontend_url)
ECR_URL=$(terraform output -raw ecr_repository_url)
BACKEND_URL=$(terraform output -raw backend_url)
cd ..

echo ""
echo "  S3 Bucket:   $FRONTEND_BUCKET"
echo "  Frontend:    $FRONTEND_URL"
echo "  ECR:         $ECR_URL"
echo "  Backend API: $BACKEND_URL"
echo ""

# 2. Build & push backend image
echo "[2/4] Fazendo build e push da imagem do backend..."
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_URL"
docker build -t cinetag-backend ./backend
docker tag cinetag-backend:latest "$ECR_URL:latest"
docker push "$ECR_URL:latest"

echo ""

# 3. Build frontend
echo "[3/4] Fazendo build do frontend..."
cd frontend
VITE_API_BASE_URL="$BACKEND_URL" \
VITE_TMDB_API_KEY="$VITE_TMDB_API_KEY" \
VITE_TMDB_BASE_URL="https://api.themoviedb.org/3" \
VITE_TMDB_IMAGE_BASE_URL="https://image.tmdb.org/t/p/w500" \
npm run build
cd ..

echo ""

# 4. Upload frontend to S3
echo "[4/4] Fazendo upload do frontend para o S3..."
aws s3 sync frontend/dist "s3://$FRONTEND_BUCKET" --delete

# Invalidate CloudFront cache
DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[?DomainName=='${FRONTEND_BUCKET}.s3.${REGION}.amazonaws.com']].Id" --output text)
if [ -n "$DIST_ID" ]; then
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*" > /dev/null
  echo "  CloudFront cache invalidado."
fi

echo ""
echo "=== Deploy concluído ==="
echo ""
echo "  Frontend: $FRONTEND_URL"
echo "  Backend:  $BACKEND_URL"
echo ""
