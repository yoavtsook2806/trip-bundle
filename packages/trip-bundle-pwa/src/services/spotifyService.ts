// Spotify API Types
export interface SpotifyUserProfile {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{ url: string }>;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
}

export interface SpotifyUserPreferences {
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  topGenres: string[];
  musicProfile: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
  };
}

export class SpotifyService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private redirectUri: string = `${window.location.origin}/spotify-callback.html`;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private codeVerifier: string | null = null;

  constructor() {
    // Load configuration from environment variables
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || null;
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || null;
    
    console.log('🎵 [SPOTIFY_SERVICE] Initializing...', {
      clientId: this.clientId,
      hasClientSecret: !!this.clientSecret,
      redirectUri: this.redirectUri
    });
    
    // Load existing tokens from localStorage
    this.loadTokensFromStorage();
  }

  setRedirectUri(uri: string) {
    this.redirectUri = uri;
  }

  // Authentication
  async authenticate(): Promise<boolean> {
    console.log('🎵 [DEBUG] Starting Spotify authentication...');
    
    if (!this.clientId) {
      throw new Error('Spotify Client ID not configured. Please check your environment variables.');
    }

    // Check if already authenticated
    if (this.isAuthenticated()) {
      console.log('🎵 [DEBUG] Already authenticated with valid token');
      return true;
    }

    // Try to restore from localStorage
    this.loadTokensFromStorage();
    if (this.isAuthenticated()) {
      console.log('🎵 [DEBUG] Successfully restored valid tokens from localStorage');
      return true;
    }

    // Try to refresh token if available
    if (this.refreshToken) {
      console.log('🎵 [DEBUG] Attempting to refresh access token...');
      try {
        const refreshed = await this.refreshAccessToken();
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
        const authUrl = await this.getAuthUrl();
        
        // Clear any previous auth state
        localStorage.removeItem('spotify_auth_code');
        localStorage.removeItem('spotify_auth_error');
        
        // For mobile/PWA: Use direct redirect instead of popup
        if (this.isMobileOrPWA()) {
          console.log('🎵 [DEBUG] Mobile/PWA detected - using direct redirect');
          window.location.href = authUrl;
          return;
        }
        
        // Desktop: Try popup first, fallback to redirect
        const popup = window.open(
          authUrl,
          'spotify-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          console.log('🎵 [DEBUG] Popup blocked - falling back to redirect');
          window.location.href = authUrl;
          return;
        }

        let authCompleted = false;
        let checkClosed: NodeJS.Timeout;

        // Listen for message from popup
        const messageListener = async (event: MessageEvent) => {
          if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            try {
              const success = await this.handleCallback(event.data.code);
              popup.close();
              resolve(success);
            } catch (error) {
              popup.close();
              reject(error);
            }
          } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
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
          const authCode = localStorage.getItem('spotify_auth_code');
          const authError = localStorage.getItem('spotify_auth_error');
          
          if (authCode && !authCompleted) {
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            localStorage.removeItem('spotify_auth_code');
            
            try {
              const success = await this.handleCallback(authCode);
              popup.close();
              resolve(success);
            } catch (error) {
              popup.close();
              reject(error);
            }
            return;
          }
          
          if (authError && !authCompleted) {
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            localStorage.removeItem('spotify_auth_error');
            popup.close();
            reject(new Error(authError));
            return;
          }
          
          if (popup.closed && !authCompleted) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            if (this.isAuthenticated()) {
              resolve(true);
            } else {
              reject(new Error('Authentication was cancelled or failed'));
            }
          }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed && !authCompleted) {
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
    
    // Store code verifier in localStorage for direct redirects
    localStorage.setItem('spotify_code_verifier', this.codeVerifier);

    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-top-read',
      'user-read-recently-played',
      'user-library-read',
      'playlist-read-private'
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

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    localStorage.setItem('spotify_auth_in_progress', 'true');
    
    return authUrl;
  }

  async handleCallback(code: string): Promise<boolean> {
    // Try to get code verifier from localStorage if not in memory
    if (!this.codeVerifier) {
      this.codeVerifier = localStorage.getItem('spotify_code_verifier');
    }
    
    if (!this.clientId || !this.codeVerifier) {
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
      
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(tokenRequestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      this.saveTokensToStorage();
      
      // Clean up code verifier from localStorage
      localStorage.removeItem('spotify_code_verifier');
      
      return true;
    } catch (error) {
      console.error('🎵 [DEBUG] Spotify callback error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken || !this.clientId) {
      return false;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
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

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      if (data.refresh_token) {
        this.refreshToken = data.refresh_token;
      }
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      this.saveTokensToStorage();
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

    // Create a basic music profile
    const musicProfile = {
      danceability: 0.5,
      energy: 0.5,
      valence: 0.5,
      acousticness: 0.5,
      instrumentalness: 0.5
    };

    return {
      topArtists: topArtists.slice(0, 10),
      topTracks: topTracks.slice(0, 10),
      topGenres,
      musicProfile
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

  private generateCodeVerifier(): string {
    return this.generateRandomString(128);
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private isMobileOrPWA(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.matchMedia('(display-mode: standalone)').matches;
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
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  isConfigured(): boolean {
    return this.clientId !== null;
  }
}

// Create singleton instance
const spotifyService = new SpotifyService();
export default spotifyService;