# Step 1: Builder
FROM node:18-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .
RUN pnpm build

# Step 2: Production image
FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=local
EXPOSE 3000

CMD ["pnpm", "start"]
