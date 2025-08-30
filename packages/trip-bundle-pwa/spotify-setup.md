# Spotify Integration Setup Guide

## Your Spotify App Configuration

**Client ID**: `bc5f89044c854343a3408f12a4f4a0be` ✅ (Already configured)

## Required Spotify App Settings

### 1. Redirect URIs to Add in Spotify Dashboard

Add these redirect URIs to your Spotify app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard):

```
http://localhost:5173/spotify-callback.html
http://localhost:5174/spotify-callback.html  
http://localhost:5175/spotify-callback.html
http://192.168.1.212:5173/spotify-callback.html
http://192.168.1.212:5174/spotify-callback.html
http://192.168.1.212:5175/spotify-callback.html
```

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

#### Mock Mode (Current - No Spotify App Needed)
```bash
VITE_MOCK=true
# Uses mock Spotify data
```

#### Real Spotify Mode
```bash
VITE_MOCK=false
VITE_SPOTIFY_MOCK=false
# Uses real Spotify OAuth
```

## Current Status

✅ Client ID configured in code
✅ Callback page created
✅ Integration tab ready
✅ Mock mode working

## Next Steps

1. **Test Mock Mode** (works now):
   - Go to http://192.168.1.212:5175/
   - Click Integrations tab (🔗)
   - Toggle Spotify ON
   - See mock data

2. **Setup Real Integration**:
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
