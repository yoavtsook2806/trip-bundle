export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string; id: string }[];
  album: { name: string; id: string };
  popularity: number;
  preview_url?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: { total: number };
  images: { url: string; height: number; width: number }[];
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: { total: number };
  images: { url: string; height: number; width: number }[];
}

export interface SpotifyUserPreferences {
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  topGenres: string[];
  musicProfile: {
    danceability: number;
    energy: number;
    valence: number; // positivity
    acousticness: number;
    instrumentalness: number;
  };
}

class SpotifyIntegration {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string = this.getRedirectUri();
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private codeVerifier: string | null = null;

  constructor() {
    // Get credentials from environment variables or use your provided Client ID
    this.clientId = (import.meta as any).env?.VITE_SPOTIFY_CLIENT_ID || 'bc5f89044c854343a3408f12a4f4a0be';
    this.clientSecret = (import.meta as any).env?.VITE_SPOTIFY_CLIENT_SECRET || null;
    
    // Try to restore tokens from localStorage
    this.loadTokensFromStorage();
  }

  // Get proper redirect URI - always use 127.0.0.1 to match Spotify dashboard config
  private getRedirectUri(): string {
    const origin = window.location.origin;
    console.log('🎵 [DEBUG] Original origin:', origin);
    
    // Always use 127.0.0.1 to match Spotify app configuration
    const spotifyCompatibleOrigin = origin.replace('localhost', '127.0.0.1');
    const redirectUri = spotifyCompatibleOrigin + '/spotify-callback.html';
    
    console.log('🎵 [DEBUG] Generated redirect URI:', redirectUri);
    return redirectUri;
  }

  // Configuration
  setCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  // PKCE helper methods
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  setRedirectUri(uri: string) {
    this.redirectUri = uri;
  }

  // Authentication
  async authenticate(): Promise<boolean> {
    console.log('🎵 [DEBUG] Starting Spotify authentication...');
    console.log('🎵 [DEBUG] Client ID:', this.clientId);
    console.log('🎵 [DEBUG] Client Secret available:', !!this.clientSecret);
    console.log('🎵 [DEBUG] Redirect URI:', this.redirectUri);
    console.log('🎵 [DEBUG] Current origin:', window.location.origin);
    
    if (!this.clientId) {
      console.error('🎵 [DEBUG] No Client ID configured!');
      throw new Error('Spotify Client ID not configured. Please check your environment variables.');
    }

    // Check if already authenticated
    console.log('🎵 [DEBUG] Checking if already authenticated...');
    if (this.isAuthenticated()) {
      console.log('🎵 [DEBUG] Already authenticated with valid token');
      return true;
    }

    // Try to restore from localStorage
    console.log('🎵 [DEBUG] Trying to restore tokens from localStorage...');
    this.loadTokensFromStorage();
    console.log('🎵 [DEBUG] After loading from storage - Access token:', !!this.accessToken, 'Refresh token:', !!this.refreshToken);
    if (this.isAuthenticated()) {
      console.log('🎵 [DEBUG] Successfully restored valid tokens from localStorage');
      return true;
    }

    // Try to refresh token if available
    if (this.refreshToken) {
      console.log('🎵 [DEBUG] Attempting to refresh access token...');
      try {
        const refreshed = await this.refreshAccessToken();
        console.log('🎵 [DEBUG] Token refresh result:', refreshed);
        if (refreshed && this.isAuthenticated()) {
          console.log('🎵 [DEBUG] Successfully refreshed token');
          return true;
        }
      } catch (error) {
        console.warn('🎵 [DEBUG] Failed to refresh Spotify token:', error);
      }
    }

    // Start OAuth flow
    console.log('🎵 [DEBUG] Starting OAuth flow...');
    return this.startOAuthFlow();
  }



  private startOAuthFlow(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('🎵 [DEBUG] Generating auth URL...');
        const authUrl = await this.getAuthUrl();
        console.log('🎵 [DEBUG] Auth URL generated:', authUrl);
        
        // Clear any previous auth state
        console.log('🎵 [DEBUG] Clearing previous auth state from localStorage...');
        localStorage.removeItem('spotify_auth_code');
        localStorage.removeItem('spotify_auth_error');
        
        // Open popup window for OAuth
        console.log('🎵 [DEBUG] Opening popup window for OAuth...');
        const popup = window.open(
          authUrl,
          'spotify-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          console.error('🎵 [DEBUG] Failed to open popup window');
          reject(new Error('Failed to open authentication popup. Please allow popups for this site.'));
          return;
        }

        console.log('🎵 [DEBUG] Popup window opened successfully');

        let authCompleted = false;
        let checkClosed: NodeJS.Timeout;

        // Listen for message from popup (if callback sends postMessage)
        const messageListener = async (event: MessageEvent) => {
          console.log('🎵 [DEBUG] Received message from popup:', event.data, 'Origin:', event.origin);
          
          // Accept messages from 127.0.0.1 origins (consistent with our setup)
          const currentOrigin = window.location.origin;
          const expectedOrigin = currentOrigin.replace('localhost', '127.0.0.1');
          
          if (event.origin !== expectedOrigin) {
            console.log('🎵 [DEBUG] Message origin mismatch. Expected:', expectedOrigin, 'Got:', event.origin);
            return;
          }
          
          console.log('🎵 [DEBUG] Message origin accepted');
          
          if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
            console.log('🎵 [DEBUG] Received auth success message with code:', event.data.code);
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            // Exchange authorization code for tokens
            try {
              console.log('🎵 [DEBUG] Starting token exchange...');
              const success = await this.handleCallback(event.data.code);
              console.log('🎵 [DEBUG] Token exchange result:', success);
              
              // Close popup after successful token exchange
              if (!popup.closed) {
                popup.close();
              }
              
              resolve(success);
            } catch (error) {
              console.error('🎵 [DEBUG] Token exchange error:', error);
              if (!popup.closed) {
                popup.close();
              }
              reject(error);
            }
          } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
            console.error('🎵 [DEBUG] Received auth error message:', event.data.error);
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        };

        window.addEventListener('message', messageListener);

        // Poll for popup closure and check localStorage as backup
        checkClosed = setInterval(async () => {
          // Check localStorage for auth code (backup method)
          const authCode = localStorage.getItem('spotify_auth_code');
          const authError = localStorage.getItem('spotify_auth_error');
          
          console.log('🎵 [DEBUG] Polling - Auth code in localStorage:', !!authCode, 'Auth error:', authError, 'Popup closed:', popup.closed);
          
          if (authCode && !authCompleted) {
            console.log('🎵 [DEBUG] Found auth code in localStorage (backup method):', authCode);
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            localStorage.removeItem('spotify_auth_code');
            
            try {
              console.log('🎵 [DEBUG] Starting token exchange via localStorage backup...');
              const success = await this.handleCallback(authCode);
              console.log('🎵 [DEBUG] Token exchange via localStorage result:', success);
              if (!popup.closed) {
                popup.close();
              }
              resolve(success);
            } catch (error) {
              console.error('🎵 [DEBUG] Token exchange error via localStorage:', error);
              if (!popup.closed) {
                popup.close();
              }
              reject(error);
            }
            return;
          }
          
          if (authError && !authCompleted) {
            console.error('🎵 [DEBUG] Found auth error in localStorage:', authError);
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            localStorage.removeItem('spotify_auth_error');
            popup.close();
            reject(new Error(authError));
            return;
          }
          
          if (popup.closed) {
            console.log('🎵 [DEBUG] Popup window was closed');
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            // Only reject if auth wasn't completed successfully
            if (!authCompleted) {
              console.log('🎵 [DEBUG] Popup closed without completion - checking if tokens are available...');
              // Final check if authentication was successful (tokens might be in storage)
              if (this.isAuthenticated()) {
                console.log('🎵 [DEBUG] Found valid tokens after popup closed - success!');
                resolve(true);
              } else {
                console.log('🎵 [DEBUG] No valid tokens found - authentication failed');
                reject(new Error('Authentication was cancelled or failed'));
              }
            }
          }
        }, 500); // Check more frequently

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed && !authCompleted) {
            console.log('🎵 [DEBUG] Authentication timeout reached');
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error('Authentication timeout - please try again'));
          }
        }, 5 * 60 * 1000);

      } catch (error) {
        reject(error);
      }
    });
  }

  async getAuthUrl(): Promise<string> {
    if (!this.clientId) {
      throw new Error('Spotify client ID not configured');
    }

    // Generate PKCE parameters
    this.codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(this.codeVerifier);

    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-library-read',
      'playlist-read-private',
      'user-read-playback-state',
      'user-read-currently-playing'
    ].join(' ');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: scopes,
      redirect_uri: this.redirectUri,
      state: this.generateRandomString(16),
      code_challenge_method: 'S256',
      code_challenge: codeChallenge
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    console.log('🎵 [DEBUG] handleCallback called with code:', code);
    console.log('🎵 [DEBUG] Client ID available:', !!this.clientId);
    console.log('🎵 [DEBUG] Code verifier available:', !!this.codeVerifier);
    console.log('🎵 [DEBUG] Redirect URI:', this.redirectUri);
    
    if (!this.clientId || !this.codeVerifier) {
      console.error('🎵 [DEBUG] Missing required parameters for token exchange');
      throw new Error('Spotify client ID or code verifier not configured');
    }

    try {
      const tokenRequestBody = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: this.codeVerifier
      };
      
      console.log('🎵 [DEBUG] Token request body:', tokenRequestBody);
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(tokenRequestBody)
      });

      console.log('🎵 [DEBUG] Token response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 [DEBUG] Token exchange error response:', errorText);
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🎵 [DEBUG] Token response data:', {
        access_token: !!data.access_token,
        refresh_token: !!data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type
      });
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      console.log('🎵 [DEBUG] Saving tokens to storage...');
      this.saveTokensToStorage();
      console.log('🎵 [DEBUG] Tokens saved successfully');
      return true;
    } catch (error) {
      console.error('🎵 [DEBUG] Spotify callback error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    console.log('🎵 [DEBUG] Attempting to refresh access token...');
    console.log('🎵 [DEBUG] Refresh token available:', !!this.refreshToken);
    console.log('🎵 [DEBUG] Client ID available:', !!this.clientId);
    console.log('🎵 [DEBUG] Client Secret available:', !!this.clientSecret);
    
    if (!this.refreshToken || !this.clientId) {
      console.log('🎵 [DEBUG] Missing refresh token or client ID');
      return false;
    }

    try {
      // For PKCE flow, we might not have client secret, so try both methods
      let response;
      
      if (this.clientSecret) {
        console.log('🎵 [DEBUG] Using client secret for refresh');
        response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken
          })
        });
      } else {
        console.log('🎵 [DEBUG] Using PKCE method for refresh (no client secret)');
        response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: this.clientId
          })
        });
      }

      console.log('🎵 [DEBUG] Refresh response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 [DEBUG] Refresh token error:', errorText);
        return false;
      }

      const data = await response.json();
      console.log('🎵 [DEBUG] Refresh response data:', {
        access_token: !!data.access_token,
        refresh_token: !!data.refresh_token,
        expires_in: data.expires_in
      });
      
      this.accessToken = data.access_token;
      if (data.refresh_token) {
        this.refreshToken = data.refresh_token;
      }
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      this.saveTokensToStorage();
      console.log('🎵 [DEBUG] Token refresh successful');
      return true;
    } catch (error) {
      console.error('🎵 [DEBUG] Token refresh error:', error);
      return false;
    }
  }

  // API Methods
  async getUserProfile(): Promise<SpotifyUserProfile> {
    const response = await this.makeApiRequest('/me');
    return response;
  }



  async getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20): Promise<SpotifyArtist[]> {
    const response = await this.makeApiRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
    return response.items;
  }

  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit = 20): Promise<SpotifyTrack[]> {
    const response = await this.makeApiRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
    return response.items;
  }

  async getUserPreferences(): Promise<SpotifyUserPreferences> {
    console.log('🎵 Fetching user preferences...');
    const [topArtists, topTracks] = await Promise.all([
      this.getTopArtists(),
      this.getTopTracks()
    ]);
    
    console.log('🎵 Top artists:', topArtists);
    console.log('🎵 Top tracks:', topTracks);

    // Extract genres from top artists
    const genreCount: Record<string, number> = {};
    topArtists.forEach(artist => {
      artist.genres.forEach(genre => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([genre]) => genre);

    // Try to get audio features for top tracks to create music profile
    let musicProfile;
    try {
      console.log('🎵 [DEBUG] Attempting to fetch audio features...');
      const trackIds = topTracks.slice(0, 10).map(track => track.id);
      console.log('🎵 [DEBUG] Track IDs for audio features:', trackIds);
      const audioFeatures = await this.getAudioFeatures(trackIds);
      console.log('🎵 [DEBUG] Audio features received:', audioFeatures);
      musicProfile = this.calculateMusicProfile(audioFeatures);
      console.log('🎵 [DEBUG] Music profile calculated:', musicProfile);
    } catch (error) {
      console.warn('🎵 [DEBUG] Failed to get audio features, using default profile:', error);
      // Use default music profile if audio features fail
      musicProfile = {
        danceability: 0.5,
        energy: 0.5,
        valence: 0.5,
        acousticness: 0.5,
        instrumentalness: 0.5
      };
    }

    return {
      topArtists: topArtists.slice(0, 10),
      topTracks: topTracks.slice(0, 10),
      topGenres,
      musicProfile
    };
  }



  private async getAudioFeatures(trackIds: string[]) {
    if (trackIds.length === 0) {
      console.log('🎵 [DEBUG] No track IDs provided for audio features');
      return [];
    }
    
    console.log('🎵 [DEBUG] Requesting audio features for tracks:', trackIds);
    const endpoint = `/audio-features?ids=${trackIds.join(',')}`;
    console.log('🎵 [DEBUG] Audio features endpoint:', endpoint);
    
    const response = await this.makeApiRequest(endpoint);
    console.log('🎵 [DEBUG] Audio features raw response:', response);
    
    const filteredFeatures = response.audio_features.filter((feature: any) => feature !== null);
    console.log('🎵 [DEBUG] Filtered audio features:', filteredFeatures);
    
    return filteredFeatures;
  }

  private calculateMusicProfile(audioFeatures: any[]) {
    if (audioFeatures.length === 0) {
      return {
        danceability: 0.5,
        energy: 0.5,
        valence: 0.5,
        acousticness: 0.5,
        instrumentalness: 0.5
      };
    }

    const sum = audioFeatures.reduce((acc, feature) => ({
      danceability: acc.danceability + feature.danceability,
      energy: acc.energy + feature.energy,
      valence: acc.valence + feature.valence,
      acousticness: acc.acousticness + feature.acousticness,
      instrumentalness: acc.instrumentalness + feature.instrumentalness
    }), {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0
    });

    const count = audioFeatures.length;
    return {
      danceability: sum.danceability / count,
      energy: sum.energy / count,
      valence: sum.valence / count,
      acousticness: sum.acousticness / count,
      instrumentalness: sum.instrumentalness / count
    };
  }

  // Utility methods
  private async makeApiRequest(endpoint: string): Promise<any> {
    await this.ensureValidToken();
    
    if (!this.accessToken) {
      throw new Error('No valid access token available');
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the request
          return this.makeApiRequest(endpoint);
        }
      }
      throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry) {
      throw new Error('No access token available');
    }

    // Check if token expires in the next 5 minutes
    if (Date.now() + 5 * 60 * 1000 > this.tokenExpiry) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        throw new Error('Unable to refresh access token');
      }
    }
  }

  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  private saveTokensToStorage(): void {
    if (this.accessToken) {
      localStorage.setItem('spotify_access_token', this.accessToken);
    }
    if (this.refreshToken) {
      localStorage.setItem('spotify_refresh_token', this.refreshToken);
    }
    if (this.tokenExpiry) {
      localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());
    }
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    if (expiry) {
      this.tokenExpiry = parseInt(expiry);
    }
  }

  // Public utility methods
  isAuthenticated(): boolean {
    return this.accessToken !== null && this.tokenExpiry !== null && Date.now() < this.tokenExpiry;
  }

  disconnect(): void {
    console.log('🎵 [DEBUG] Disconnecting and clearing all tokens...');
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  // Force clear tokens (for debugging)
  forceClearTokens(): void {
    console.log('🎵 [DEBUG] Force clearing all Spotify tokens...');
    this.disconnect();
  }

  isConfigured(): boolean {
    return this.clientId !== null && this.clientSecret !== null;
  }
}

export default SpotifyIntegration;
