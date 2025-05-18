# 1. Build Stage
FROM node:18-alpine AS builder

# install pg_isready
RUN apk add --no-cache postgresql-client

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate prisma
RUN npx prisma generate

# Compile
RUN npm run build



# 2. Production Stage
FROM node:18-alpine AS runner

# install pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

# copy tsconfig so tsconfig-paths can load aliases
COPY tsconfig.json ./

# Copy only necessary build artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose API port (optional, useful for docs/docker-compose)
EXPOSE 3000

# Command to run your app
CMD ["npm", "run", "start"]
