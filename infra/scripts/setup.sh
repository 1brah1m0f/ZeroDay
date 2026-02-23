#!/bin/bash
# Setup script for local development
set -e

echo "📦 Installing dependencies..."
pnpm install

echo "🗄️ Starting database..."
cd infra && docker compose up -d db redis && cd ..

echo "⏳ Waiting for database..."
sleep 3

echo "🔄 Running Prisma migrations..."
cd apps/api && npx prisma migrate dev --name init && cd ../..

echo "🚀 Starting development servers..."
pnpm dev
