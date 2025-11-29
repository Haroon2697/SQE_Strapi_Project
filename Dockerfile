# Use Node.js LTS version (20.x) for better performance and security
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies and required tools
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy application files
COPY . .

# Build the application
RUN yarn build

# Expose the Strapi port
EXPOSE 1337

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start the application
CMD ["yarn", "start"]