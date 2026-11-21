#!/bin/sh
set -e

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

exec "$@"
