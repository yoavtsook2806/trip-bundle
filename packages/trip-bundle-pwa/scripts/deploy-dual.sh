#!/bin/bash

# Deploy Both Mock and Real AI Versions to Same Repository
# This script deploys both versions to the same GitHub repository with different paths

set -e

echo "🚀 Deploying Both Mock and Real AI Versions..."

# Check if OpenAI API key is set for real AI deployment
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Error: OPENAI_API_KEY environment variable is not set"
    echo "Please set your OpenAI API key:"
    echo "export OPENAI_API_KEY=\"sk-proj-your-api-key-here\""
    exit 1
fi

echo "✅ OpenAI API key is set"

# Create deployment directory
rm -rf deploy-temp
mkdir -p deploy-temp

echo "🔨 Building mock version..."
npm run build:mock
mkdir -p deploy-temp/mock
cp -r dist/* deploy-temp/mock/

echo "🔨 Building real AI version..."
OPENAI_API_KEY=$OPENAI_API_KEY npm run build:prod
mkdir -p deploy-temp/real
cp -r dist/* deploy-temp/real/

# Create index.html that redirects to mock by default
cat > deploy-temp/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Bundle - Choose Version</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 { margin-bottom: 30px; font-size: 2.5em; }
        .version-card {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            padding: 30px;
            margin: 20px 0;
            transition: transform 0.3s ease;
        }
        .version-card:hover { transform: translateY(-5px); }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 10px;
            transition: background 0.3s ease;
        }
        .btn:hover { background: #45a049; }
        .btn.real { background: #ff6b6b; }
        .btn.real:hover { background: #ff5252; }
        .cost { font-size: 0.9em; opacity: 0.8; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎒 Trip Bundle</h1>
        <p>Choose your experience:</p>
        
        <div class="version-card">
            <h2>🎭 Demo Version (Free)</h2>
            <p>Pre-built trip bundles with sample data</p>
            <p>Perfect for testing and demonstrations</p>
            <a href="./mock/" class="btn">Try Demo Version</a>
            <div class="cost">✅ Completely Free</div>
        </div>
        
        <div class="version-card">
            <h2>🤖 Real AI Version</h2>
            <p>Powered by OpenAI GPT-5-mini</p>
            <p>Generates personalized trip bundles</p>
            <a href="./real/" class="btn real">Use Real AI</a>
            <div class="cost">💰 ~$0.002 per trip generation</div>
        </div>
    </div>
</body>
</html>
EOF

echo "📦 Deploying to GitHub Pages..."
npx gh-pages -d deploy-temp -b gh-pages

echo "🧹 Cleaning up..."
rm -rf deploy-temp

echo "🎉 Dual deployment completed!"
echo ""
echo "📋 Your apps are now available at:"
echo "🏠 Main Page: https://yoavtsook2806.github.io/trip-bundle/"
echo "🎭 Mock Version: https://yoavtsook2806.github.io/trip-bundle/mock/"
echo "🤖 Real AI Version: https://yoavtsook2806.github.io/trip-bundle/real/"
echo ""
echo "💡 The main page lets users choose between mock and real AI versions"
