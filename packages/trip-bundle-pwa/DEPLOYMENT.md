# Trip Bundle PWA - Deployment Guide

This PWA can be deployed to two different GitHub Pages URLs:

## 🚀 Deployment URLs

After deployment, your app will be available at:

- **Mock Version (Free)**: `https://yoavtsook2806.github.io/trip-bundle-mock/`
  - Uses sample data, no API costs
  - Perfect for demos and testing

- **Production Version (Requires OpenAI API)**: `https://yoavtsook2806.github.io/trip-bundle/`
  - Uses real OpenAI API calls
  - Requires valid API key in environment

## 📋 Deployment Commands

### Deploy Mock Version Only
```bash
yarn workspace trip-bundle-pwa deploy:mock
```

### Deploy Production Version Only
```bash
yarn workspace trip-bundle-pwa deploy:prod
```

### Deploy Both Versions
```bash
yarn workspace trip-bundle-pwa deploy:both
```

## 🔧 How It Works

1. **Mock Build**: `build:mock` - Sets `VITE_MOCK=true` and `GITHUB_PAGES=true`
2. **Production Build**: `build:prod` - Sets `GITHUB_PAGES=true` only
3. **Separate Branches**: 
   - Mock version deploys to `gh-pages-mock` branch
   - Production version deploys to `gh-pages-prod` branch
4. **GitHub Pages**: Each branch serves a different subdomain

## 🌐 GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set up two sources:
   - Source: `gh-pages-mock` branch → `/trip-bundle-mock/`
   - Source: `gh-pages-prod` branch → `/trip-bundle/`

## 🛠️ Environment Variables

For production deployment, ensure these are set:
- `VITE_OPENAI_API_KEY` - Your OpenAI API key
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
