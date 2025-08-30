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
  private redirectUri: string = window.location.origin + '/spotify-callback.html';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Get credentials from environment variables or use your provided Client ID
    this.clientId = (import.meta as any).env?.VITE_SPOTIFY_CLIENT_ID || 'bc5f89044c854343a3408f12a4f4a0be';
    this.clientSecret = (import.meta as any).env?.VITE_SPOTIFY_CLIENT_SECRET || null;
    
    // Try to restore tokens from localStorage
    this.loadTokensFromStorage();
  }

  // Configuration
  setCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  setRedirectUri(uri: string) {
    this.redirectUri = uri;
  }

  // Authentication
  async authenticate(): Promise<boolean> {
    // Check if we're in mock mode
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true' || 
                       (import.meta as any).env?.VITE_SPOTIFY_MOCK === 'true';
    
    if (isMockMode) {
      console.log('🎭 Using Spotify mock mode - Client ID configured: bc5f89044c854343a3408f12a4f4a0be');
      return this.authenticateMock();
    }

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

  private async authenticateMock(): Promise<boolean> {
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Set mock tokens
    this.accessToken = 'mock_access_token';
    this.refreshToken = 'mock_refresh_token';
    this.tokenExpiry = Date.now() + (3600 * 1000); // 1 hour from now
    
    // Store in localStorage for persistence
    this.saveTokensToStorage();
    
    return true;
  }

  private startOAuthFlow(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const authUrl = this.getAuthUrl();
        
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

        // Poll for popup closure or success
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Check if authentication was successful
            if (this.isAuthenticated()) {
              resolve(true);
            } else {
              reject(new Error('Authentication was cancelled or failed'));
            }
          }
        }, 1000);

        // Listen for message from popup (if callback sends postMessage)
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'SPOTIFY_AUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            resolve(true);
          } else if (event.data.type === 'SPOTIFY_AUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error || 'Authentication failed'));
          }
        };

        window.addEventListener('message', messageListener);

        // Timeout after 5 minutes
        setTimeout(() => {
          if (!popup.closed) {
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

  getAuthUrl(): string {
    if (!this.clientId) {
      throw new Error('Spotify client ID not configured');
    }

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
      state: this.generateRandomString(16)
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error('Spotify credentials not configured');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri
        })
      });

      if (!response.ok) {
        throw new Error(`Token exchange failed: ${response.status}`);
      }

      const data = await response.json();
      
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      this.saveTokensToStorage();
      return true;
    } catch (error) {
      console.error('Spotify callback error:', error);
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
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true' || 
                       (import.meta as any).env?.VITE_SPOTIFY_MOCK === 'true';
    
    if (isMockMode) {
      return this.getMockUserProfile();
    }
    
    const response = await this.makeApiRequest('/me');
    return response;
  }

  private getMockUserProfile(): SpotifyUserProfile {
    return {
      id: 'mock_user_123',
      display_name: 'Demo User',
      email: 'demo@example.com',
      country: 'US',
      followers: { total: 42 },
      images: [{
        url: 'https://via.placeholder.com/150x150/1db954/ffffff?text=Demo',
        height: 150,
        width: 150
      }]
    };
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
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true' || 
                       (import.meta as any).env?.VITE_SPOTIFY_MOCK === 'true';
    
    if (isMockMode) {
      return this.getMockUserPreferences();
    }
    
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

  private getMockUserPreferences(): SpotifyUserPreferences {
    const mockArtists: SpotifyArtist[] = [
      {
        id: 'artist_1',
        name: 'The Beatles',
        genres: ['rock', 'pop', 'classic rock'],
        popularity: 85,
        followers: { total: 5000000 },
        images: [{ url: 'https://via.placeholder.com/300x300/1db954/ffffff?text=Beatles', height: 300, width: 300 }]
      },
      {
        id: 'artist_2',
        name: 'Daft Punk',
        genres: ['electronic', 'house', 'french house'],
        popularity: 80,
        followers: { total: 3000000 },
        images: [{ url: 'https://via.placeholder.com/300x300/1db954/ffffff?text=Daft+Punk', height: 300, width: 300 }]
      },
      {
        id: 'artist_3',
        name: 'Miles Davis',
        genres: ['jazz', 'bebop', 'cool jazz'],
        popularity: 75,
        followers: { total: 1500000 },
        images: [{ url: 'https://via.placeholder.com/300x300/1db954/ffffff?text=Miles', height: 300, width: 300 }]
      }
    ];

    const mockTracks: SpotifyTrack[] = [
      {
        id: 'track_1',
        name: 'Come Together',
        artists: [{ name: 'The Beatles', id: 'artist_1' }],
        album: { name: 'Abbey Road', id: 'album_1' },
        popularity: 85,
        preview_url: undefined
      },
      {
        id: 'track_2',
        name: 'One More Time',
        artists: [{ name: 'Daft Punk', id: 'artist_2' }],
        album: { name: 'Discovery', id: 'album_2' },
        popularity: 80,
        preview_url: undefined
      }
    ];

    return {
      topArtists: mockArtists,
      topTracks: mockTracks,
      topGenres: ['rock', 'electronic', 'jazz', 'pop', 'house'],
      musicProfile: {
        danceability: 0.7,
        energy: 0.8,
        valence: 0.6,
        acousticness: 0.3,
        instrumentalness: 0.2
      }
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
