#!/usr/bin/env bash
# ==============================================================================
# Keep-Alive Ping Script for Free Cloud Tiers (Render, Railway, Fly)
# Pings your hosted storefront and backend every 10 minutes to prevent sleep.
# Usage: ./scripts/keep-alive.sh <STOREFRONT_URL> <BACKEND_URL>
# Example: ./scripts/keep-alive.sh https://my-store.onrender.com https://my-backend.onrender.com
# ==============================================================================

STOREFRONT_URL="${1:-http://localhost:8000}"
BACKEND_URL="${2:-http://localhost:9000/health}"
INTERVAL_SECONDS=600 # 10 minutes

echo "==> Keep-alive monitor started."
echo "==> Storefront target: ${STOREFRONT_URL}"
echo "==> Backend target:    ${BACKEND_URL}"
echo "==> Ping interval:     ${INTERVAL_SECONDS}s (10 min)"
echo "---------------------------------------------------------"

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Ping Storefront
  STORE_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "${STOREFRONT_URL}" || echo "FAIL")
  
  # Ping Backend Health
  BACKEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "${BACKEND_URL}" || echo "FAIL")
  
  echo "[${TIMESTAMP}] Ping -> Storefront: ${STORE_CODE} | Backend: ${BACKEND_CODE}"
  
  sleep "${INTERVAL_SECONDS}"
done

