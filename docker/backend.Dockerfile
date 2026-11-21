# ==============================================================================
# Multi-Stage Dockerfile for Medusa v2 Backend (@dtc/backend)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base dependencies & build
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install PNPM directly via npm
RUN npm install -g pnpm@12.15.0

# Copy monorepo manifests for cached dependency installation
COPY final/package.json final/pnpm-lock.yaml final/pnpm-workspace.yaml ./
COPY final/apps/backend/package.json ./apps/backend/
COPY final/apps/storefront/package.json ./apps/storefront/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy backend application source
COPY final/apps/backend ./apps/backend

# Build the Medusa v2 backend and admin dashboard
WORKDIR /app/apps/backend
RUN cp -r .medusa/server/public ./public 2>/dev/null || true
ENV NODE_ENV=production
RUN pnpm build

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

RUN npm install -g pnpm@12.15.0

# Copy root manifests & node_modules
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/backend /app/apps/backend

WORKDIR /app/apps/backend
RUN cp -r .medusa/server/public ./public 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=9000
EXPOSE 9000

# Copy and setup entrypoint script
COPY docker/backend-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["./node_modules/.bin/medusa", "start"]

