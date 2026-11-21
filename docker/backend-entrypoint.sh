#!/bin/sh
set -e

echo "==> [High Fashion Backend] Checking database connectivity and executing migrations..."

# Wait for PostgreSQL to accept connections if host is provided
if [ -n "$DATABASE_URL" ]; then
  echo "==> Running Medusa database migrations (medusa db:migrate)..."
  ./node_modules/.bin/medusa db:migrate
fi

# Run initial database seed if explicitly requested
if [ "$AUTO_SEED" = "true" ]; then
  echo "==> AUTO_SEED is enabled. Running seed script..."
  ./node_modules/.bin/medusa exec ./src/scripts/seed.ts || echo "==> Seed execution finished."
fi

# Ensure publishable API key in database matches storefront key
if [ -n "$DATABASE_URL" ]; then
  PUB_KEY="${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:-pk_a1b1a57e199157b891153b25fe6a027815989c7a87fdd5cc874612e8d6723a0c}"
  node -e "
    const { Client } = require('pg');
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    client.connect()
      .then(() => client.query(\"UPDATE api_key SET token = '$PUB_KEY' WHERE type = 'publishable';\"))
      .then(() => { console.log('==> Synchronized publishable API key.'); client.end(); })
      .catch(() => client.end());
  " 2>/dev/null || true
fi

# Ensure compiled admin assets are available in public directory
if [ -d ".medusa/server/public" ]; then
  cp -r .medusa/server/public ./public
fi

# Self-ping keep-alive for platforms like Render (pings public URL every 10 mins)
if [ -n "$SELF_PING_URL" ]; then
  INTERVAL="${PING_INTERVAL:-600}"
  echo "==> [Keep-Alive] Starting self-ping for ${SELF_PING_URL} (interval: ${INTERVAL}s)..."
  (
    while true; do
      sleep "$INTERVAL"
      node -e '
        const url = process.env.SELF_PING_URL;
        fetch(url, { signal: AbortSignal.timeout(15000) })
          .then(r => console.log(`==> [Keep-Alive] Pinged ${url} - Status: ${r.status}`))
          .catch(e => console.log(`==> [Keep-Alive] Ping ${url} failed: ${e.message}`));
      ' || true
    done
  ) &
fi

echo "==> [High Fashion Backend] Starting production server on port ${PORT:-9000}..."
exec "$@"

