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

  // Get proper redirect URI - Spotify doesn't allow localhost, must use 127.0.0.1
  private getRedirectUri(): string {
    const origin = window.location.origin;
    // Replace localhost with 127.0.0.1 as Spotify requires explicit IP literals
    const spotifyCompatibleOrigin = origin.replace('localhost', '127.0.0.1');
    return spotifyCompatibleOrigin + '/spotify-callback.html';
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
    console.log('🎵 Using real Spotify integration - Client ID:', this.clientId);
    
    if (!this.clientId) {
      throw new Error('Spotify Client ID not configured. Please check your environment variables.');
    }

    // Check if already authenticated
    if (this.isAuthenticated()) {
      return true;
    }

    // Try to restore from localStorage
    this.loadTokensFromStorage();
    if (this.isAuthenticated()) {
      return true;
    }

    // Try to refresh token if available
    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        return this.isAuthenticated();
      } catch (error) {
        console.warn('Failed to refresh Spotify token:', error);
      }
    }

    // Start OAuth flow
    return this.startOAuthFlow();
  }



  private startOAuthFlow(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const authUrl = await this.getAuthUrl();
        
        // Open popup window for OAuth
        const popup = window.open(
          authUrl,
          'spotify-auth',
          'width=600,height=700,scrollbars=yes,resizable=yes'
        );

        if (!popup) {
          reject(new Error('Failed to open authentication popup. Please allow popups for this site.'));
          return;
        }

        let authCompleted = false;

        // Listen for message from popup (if callback sends postMessage)
        const messageListener = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
            authCompleted = true;
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            // Exchange authorization code for tokens
            try {
              const success = await this.handleCallback(event.data.code);
              
              // Close popup after successful token exchange
              if (!popup.closed) {
                popup.close();
              }
              
              resolve(success);
            } catch (error) {
              console.error('🎵 Token exchange error:', error);
              if (!popup.closed) {
                popup.close();
              }
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

        // Poll for popup closure or success
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            
            // Only reject if auth wasn't completed successfully
            if (!authCompleted) {
              // Check if authentication was successful (tokens might be in storage)
              if (this.isAuthenticated()) {
                resolve(true);
              } else {
                reject(new Error('Authentication was cancelled or failed'));
              }
            }
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed && !authCompleted) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error('Authentication timeout'));
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

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    if (!this.clientId || !this.codeVerifier) {
      throw new Error('Spotify client ID or code verifier not configured');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          code_verifier: this.codeVerifier
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🎵 Token exchange error response:', errorText);
        throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      this.saveTokensToStorage();
      return true;
    } catch (error) {
      console.error('🎵 Spotify callback error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken || !this.clientId || !this.clientSecret) {
      return false;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
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
      console.error('Token refresh error:', error);
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

    // Get audio features for top tracks to create music profile
    const trackIds = topTracks.slice(0, 10).map(track => track.id);
    const audioFeatures = await this.getAudioFeatures(trackIds);
    
    const musicProfile = this.calculateMusicProfile(audioFeatures);

    return {
      topArtists: topArtists.slice(0, 10),
      topTracks: topTracks.slice(0, 10),
      topGenres,
      musicProfile
    };
  }



  private async getAudioFeatures(trackIds: string[]) {
    if (trackIds.length === 0) return [];
    
    const response = await this.makeApiRequest(`/audio-features?ids=${trackIds.join(',')}`);
    return response.audio_features.filter((feature: any) => feature !== null);
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
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  isConfigured(): boolean {
    return this.clientId !== null && this.clientSecret !== null;
  }
}

export default SpotifyIntegration;
