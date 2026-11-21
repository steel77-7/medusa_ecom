# ==============================================================================
# Multi-Stage Dockerfile for High Fashion Next.js Storefront (@dtc/storefront)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Next.js application with Standalone output
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install PNPM directly via npm
RUN npm install -g pnpm@12.15.0

# Copy workspace manifests
COPY final/package.json final/pnpm-lock.yaml final/pnpm-workspace.yaml ./
COPY final/apps/backend/package.json ./apps/backend/
COPY final/apps/storefront/package.json ./apps/storefront/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy storefront source code
COPY final/apps/storefront ./apps/storefront

# Next.js build-time public arguments
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_a1b1a57e199157b891153b25fe6a027815989c7a87fdd5cc874612e8d6723a0c
ARG NEXT_PUBLIC_DEFAULT_REGION=in
ARG NEXT_PUBLIC_BASE_URL=http://localhost:8000
ARG NEXT_PUBLIC_SHOP_NAME="High Fashion"
ARG NEXT_PUBLIC_SHOP_DESCRIPTION="High Fashion Store"

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=${NEXT_PUBLIC_MEDUSA_BACKEND_URL}
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}
ENV NEXT_PUBLIC_DEFAULT_REGION=${NEXT_PUBLIC_DEFAULT_REGION}
ENV NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
ENV NEXT_PUBLIC_SHOP_NAME=${NEXT_PUBLIC_SHOP_NAME}
ENV NEXT_PUBLIC_SHOP_DESCRIPTION=${NEXT_PUBLIC_SHOP_DESCRIPTION}
ENV NODE_ENV=production

WORKDIR /app/apps/storefront
RUN pnpm build

# ------------------------------------------------------------------------------
# Stage 2: Minimal Production Runner
# ------------------------------------------------------------------------------
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000
ENV HOSTNAME="0.0.0.0"

# Create a non-root system user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build and public/static assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/storefront/public ./apps/storefront/public

# Copy entrypoint for self-ping keep-alive
COPY docker/storefront-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER nextjs

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
# Next.js standalone runner script
CMD ["sh", "-c", "if [ -f apps/storefront/server.js ]; then node apps/storefront/server.js; else node server.js; fi"]

