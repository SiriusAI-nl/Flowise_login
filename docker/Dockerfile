# Stage 1: Build stage
FROM node:20-alpine AS build

USER root

# Skip downloading Chrome for Puppeteer (if not needed)
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/
COPY packages/ui/package.json ./packages/ui/
COPY packages/components/package.json ./packages/components/

# Install build dependencies and pnpm (combined RUN commands)
RUN apk update && \
    apk add --no-cache python3 make g++ git chromium build-base cairo-dev pango-dev && \
    npm install -g pnpm typescript @types/node

# Install workspace dependencies
RUN pnpm install --no-frozen-lockfile

# Copy all source code
COPY . .

# Build components and UI
WORKDIR /app/packages/components
RUN pnpm build

WORKDIR /app/packages/ui
RUN pnpm build

# Prepare server build
WORKDIR /app/packages/server
RUN pnpm build 

# Stage 2: Runtime stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install runtime dependencies
RUN apk update && apk add --no-cache chromium 

# Set environment variable for Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy everything from the build stage
COPY --from=build /app ./

# Make the run script executable
WORKDIR /app/packages/server/bin
RUN chmod +x run

# Set working directory back to server
WORKDIR /app/packages/server

# Expose the server port
EXPOSE 3000 

# Start the server
CMD ["./bin/run", "start"]
