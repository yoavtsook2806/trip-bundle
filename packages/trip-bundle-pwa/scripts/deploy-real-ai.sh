#!/bin/bash

# Deploy Real AI Version to Separate Repository
# This script deploys the real AI version to a separate GitHub repository

set -e

echo "🚀 Deploying Real AI Version..."

# Check if OpenAI API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set your OpenAI API key:"
    echo "export OPENAI_API_KEY=\"sk-proj-your-api-key-here\""
    exit 1
fi

echo "✅ OpenAI API key is set"

# Build the production version
echo "🔨 Building production version with real AI..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Deploy to separate repository (you need to create this repo first)
REPO_URL="https://github.com/yoavtsook2806/trip-bundle-real.git"

echo "🌐 Deploying to: $REPO_URL"
echo "📦 This will be available at: https://yoavtsook2806.github.io/trip-bundle-real/"

# Deploy using gh-pages to separate repository
npx gh-pages -d dist -r $REPO_URL -b main

echo "🎉 Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://github.com/yoavtsook2806/trip-bundle-real"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'Deploy from a branch' → 'main' branch"
echo "4. Your real AI app will be available at: https://yoavtsook2806.github.io/trip-bundle-real/"
echo ""
echo "💰 Cost: ~$0.002 per trip generation"
echo "🔑 Uses your OpenAI API key for real trip generation"
