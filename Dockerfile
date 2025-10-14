# Dockerfile for a Next.js application

# 1. Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
# Using --no-frozen-lockfile because there is no package-lock.json
RUN npm install --no-frozen-lockfile

# 2. Build the application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Production image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy the standalone output
COPY --from=builder /app/.next/standalone ./
# Copy the public and static folders
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
