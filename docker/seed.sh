#!/usr/bin/env bash
# ==============================================================================
# Helper Script: Seed Medusa Database inside running Docker container
# Usage: ./docker/seed.sh
# ==============================================================================

set -e

CONTAINER_NAME="highfashion-backend"

echo "==> Checking if ${CONTAINER_NAME} is running..."
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "Error: Container ${CONTAINER_NAME} is not running."
  echo "Please start the containers first: docker compose up -d"
  exit 1
fi

echo "==> Executing database seed inside ${CONTAINER_NAME}..."
docker compose exec backend ./node_modules/.bin/medusa exec ./src/scripts/seed.ts

echo "==> Database seed completed successfully!"

