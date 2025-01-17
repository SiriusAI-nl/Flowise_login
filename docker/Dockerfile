FROM node:20-alpine

RUN apk add --update libc6-compat python3 make g++
# needed for pdfjs-dist
RUN apk add --no-cache build-base cairo-dev pango-dev

# Install Chromium
RUN apk add --no-cache chromium

# Install PNPM globally
RUN npm install -g pnpm

# Copy the .env file into the container
COPY ./packages/ui/.env .env

# Load environment variables from .env file
RUN export $(grep -v '^#' .env | xargs)

# Copy the Firebase configuration file
COPY ./packages/ui/src/config/firebase/firebaseConfig.js /usr/src/packages/ui/src/config/firebase/firebaseConfig.js

ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV NODE_OPTIONS=--max-old-space-size=8192

WORKDIR /usr/src/packages/ui

# Copy app source
COPY ./packages/ui .

RUN pnpm install
RUN pnpm build

EXPOSE 3000

ENTRYPOINT ["pnpm", "start"]