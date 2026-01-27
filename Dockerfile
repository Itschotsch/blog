FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy both package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# Remove devDependencies to keep the image small
RUN pnpm prune --prod

FROM node:22-alpine
WORKDIR /app

# Copy artifacts from builder
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000
VOLUME /app/content
ENV NODE_ENV=production
CMD [ "node", "build" ]

