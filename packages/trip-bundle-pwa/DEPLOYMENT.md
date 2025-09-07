# Trip Bundle PWA - Deployment Guide

This PWA can be deployed to two different GitHub Pages URLs with separate environments:

## 🚀 Deployment URLs

After deployment, your app will be available at:

- **Main Page**: `https://yoavtsook2806.github.io/trip-bundle/`
  - Landing page to choose between mock and real AI versions
  - Explains the difference between free demo and paid AI

- **Mock Version (Demo)**: `https://yoavtsook2806.github.io/trip-bundle/mock/`
  - Serves the mock version with sample data
  - No API costs, perfect for demos and testing
  - Uses pre-built trip bundles, no OpenAI calls

- **Real AI Version (Production)**: `https://yoavtsook2806.github.io/trip-bundle/real/`
  - Uses real OpenAI GPT-5-mini API calls
  - Costs ~$0.002 per trip generation
  - Generates unique, personalized trip bundles

## 📋 Deployment Commands

### Test Locally First (RECOMMENDED)
```bash
# Build and test mock version locally
yarn workspace trip-bundle-pwa build:mock
yarn workspace trip-bundle-pwa serve:local

# Build and test production version locally
yarn workspace trip-bundle-pwa build:prod
yarn workspace trip-bundle-pwa serve:local
```

### Deploy Both Versions (Recommended)
```bash
# Deploy both mock and real AI to same repository
OPENAI_API_KEY=$OPENAI_API_KEY yarn workspace trip-bundle-pwa deploy:dual
```

### Deploy Mock Version Only
```bash
yarn workspace trip-bundle-pwa deploy:mock
```

### Deploy Production Version Only
```bash
yarn workspace trip-bundle-pwa deploy:prod
```

## 🔧 How It Works

1. **Mock Build**: `build:mock` - Sets `VITE_MOCK=true` and `GITHUB_PAGES=true`
2. **Production Build**: `build:prod` - Sets `GITHUB_PAGES=true` only
3. **Single Branch Deployment**: 
   - Both mock and production versions deploy to `gh-pages` branch
   - GitHub Pages serves from `gh-pages` branch at `/trip-bundle/` path
   - You choose which version to deploy (mock vs production)

## 🌐 GitHub Pages Setup

GitHub Pages is configured to serve from:
- **Source**: `gh-pages` branch (root)
- **URL**: `https://yoavtsook2806.github.io/trip-bundle/`
- **Current**: Mock version (sample data, no API costs)

## 🧪 Local Testing

**ALWAYS test locally before deploying!**

1. **Build the version you want to test:**
   ```bash
   yarn workspace trip-bundle-pwa build:mock  # or build:prod
   ```

2. **Serve locally:**
   ```bash
   yarn workspace trip-bundle-pwa serve:local
   ```

3. **Open in browser:** http://localhost:8080

4. **Test key features:**
   - App loads without errors
   - PWA manifest works
   - Service worker registers
   - All routes/tabs work
   - Mock data displays (for mock build)
   - API calls work (for prod build with real API keys)

## 🛠️ Environment Variables & GitHub Setup

### For Real AI Deployment:

1. **Set OpenAI API Key** (required for real AI):
   ```bash
   export OPENAI_API_KEY="sk-proj-your-api-key-here"
   ```

2. **Deploy Real AI Version**:
   ```bash
   OPENAI_API_KEY=$OPENAI_API_KEY yarn workspace trip-bundle-pwa deploy:prod
   ```

3. **GitHub Pages Setup for Real AI**:
   
   **Option A: Separate Repository (Recommended)**
   - Create new repo: `trip-bundle-real`
   - Deploy there: `gh-pages -d dist -r https://github.com/yoavtsook2806/trip-bundle-real.git`
   - URL: `https://yoavtsook2806.github.io/trip-bundle-real/`
   
   **Option B: GitHub Pages Pro (Multiple Sites)**
   - Upgrade to GitHub Pro
   - Configure multiple GitHub Pages sites
   - Deploy to `gh-pages-prod` branch

### Environment Variables:
- `OPENAI_API_KEY` - Your OpenAI API key (required for real AI)
- `VITE_SPOTIFY_CLIENT_ID` - Spotify client ID (optional)
- `VITE_SPOTIFY_CLIENT_SECRET` - Spotify client secret (optional)

## 📱 PWA Features

Both deployed versions include:
- ✅ Service Worker for offline functionality
- ✅ Web App Manifest for installation
- ✅ Responsive design for all devices
- ✅ Local storage for user preferences
- ✅ Tab navigation between trips and preferences

## 🎯 Recommended Usage

- **Demo/Testing**: Use mock version to showcase features
- **Production**: Use production version with real API for actual trip planning
- **Development**: Test both versions before releases
