# Spotify Integration Setup Guide

## Your Spotify App Configuration

**Client ID**: `bc5f89044c854343a3408f12a4f4a0be` ✅ (Already configured)

## Required Spotify App Settings

### 1. Redirect URIs to Add in Spotify Dashboard

Add these redirect URIs to your Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard):

**IMPORTANT: Spotify requires 127.0.0.1 instead of localhost for local development**

```
http://127.0.0.1:5173/spotify-callback.html
http://127.0.0.1:5174/spotify-callback.html  
http://127.0.0.1:5175/spotify-callback.html
http://127.0.0.1:5176/spotify-callback.html
http://192.168.1.212:5173/spotify-callback.html
http://192.168.1.212:5174/spotify-callback.html
http://192.168.1.212:5175/spotify-callback.html
http://192.168.1.212:5176/spotify-callback.html
```

**Note:** `localhost` URIs will NOT work with Spotify OAuth. Always use `127.0.0.1` for local development.

### 2. Environment Configuration

Create a `.env` file in `packages/trip-bundle-pwa/` with:

```bash
# Spotify Integration
VITE_SPOTIFY_CLIENT_ID=bc5f89044c854343a3408f12a4f4a0be
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Mode Settings
VITE_MOCK=false
VITE_SPOTIFY_MOCK=false
```

### 3. Testing Modes

**Spotify Always Uses Real Integration** - No mock mode for Spotify
- VITE_MOCK=true: GPT uses mock data (saves API costs), Spotify uses real OAuth
- VITE_MOCK=false: Both GPT and Spotify use real APIs

**Why?** Spotify API is free for development, so we always use real integration for better testing.

## Current Status

✅ Client ID configured in code
✅ Callback page created
✅ Integration tab ready
✅ Mock mode working

## Next Steps

1. **Setup Spotify App** (required for any testing):
   - Add redirect URIs to Spotify app
   - Get Client Secret from Spotify

2. **Test Integration**:
   - Add redirect URIs to Spotify app
   - Get Client Secret from Spotify
   - Create .env file
   - Set VITE_MOCK=false
   - Test real OAuth flow

## Scopes Requested

Your app will request these Spotify permissions:
- `user-read-private` - Basic profile info
- `user-read-email` - Email address  
- `user-top-read` - Top artists and tracks
- `user-read-recently-played` - Recent listening history
- `playlist-read-private` - Private playlists
- `playlist-read-collaborative` - Collaborative playlists
