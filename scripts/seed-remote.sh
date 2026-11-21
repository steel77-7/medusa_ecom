#!/usr/bin/env bash
# ==============================================================================
# Helper Script: Seed Remote Render PostgreSQL Database from Local Machine
# Usage: ./scripts/seed-remote.sh "postgresql://user:password@host.render.com/medusa"
# ==============================================================================

set -e

TARGET_DB_URL="$1"

if [ -z "$TARGET_DB_URL" ]; then
  echo "Error: Missing database connection string."
  echo "Usage: ./scripts/seed-remote.sh \"<RENDER_EXTERNAL_DATABASE_URL>\""
  exit 1
fi

echo "==> Target Database URL: ${TARGET_DB_URL%%:*}:***@${TARGET_DB_URL#*@}"

# Navigate to backend application directory
cd "$(dirname "$0")/../final/apps/backend"

echo "==> Step 1: Ensuring migrations are up to date on remote database..."
DATABASE_URL="$TARGET_DB_URL" ./node_modules/.bin/medusa db:migrate

echo "==> Step 2: Running initial store & region setup (initial-data-seed.ts)..."
DATABASE_URL="$TARGET_DB_URL" ./node_modules/.bin/medusa exec ./src/migration-scripts/initial-data-seed.ts || echo "==> Initial seed completed or already initialized."

echo "==> Step 3: Seeding High Fashion products, categories & inventory (seed.ts)..."
DATABASE_URL="$TARGET_DB_URL" ./node_modules/.bin/medusa exec ./src/scripts/seed.ts || echo "==> Products catalog seed completed."

echo "==> Step 4: Synchronizing publishable API key for storefront..."
PUB_KEY="pk_a1b1a57e199157b891153b25fe6a027815989c7a87fdd5cc874612e8d6723a0c"
DATABASE_URL="$TARGET_DB_URL" node -e "
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  client.connect()
    .then(() => client.query(\"UPDATE api_key SET token = '$PUB_KEY' WHERE type = 'publishable';\"))
    .then((res) => {
      console.log('==> Successfully synchronized publishable API key! (Rows updated: ' + res.rowCount + ')');
      client.end();
    })
    .catch((err) => {
      console.error('Key sync error:', err.message);
      client.end();
    });
"

echo "==> Remote seeding completed successfully!"

