# ============================================
# Multi-stage build for Next.js on Cloud Run
# ============================================

# --- Stage 1: Dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app
# .npmrc* — peer dep 設定（legacy-peer-deps 等）を Docker ビルドに反映
COPY package.json package-lock.json* .npmrc* ./
# Prisma Client 生成（prisma generate）にスキーマファイルが必要
COPY prisma ./prisma
RUN npm ci --ignore-scripts
RUN npx prisma generate || true

# --- Stage 2: Build ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# --- Stage 3: Production ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
