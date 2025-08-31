import { makeAutoObservable } from 'mobx';

export interface UserPreference {
  id: string;
  type: 'music' | 'sports' | 'culture' | 'food' | 'nature' | 'nightlife';
  value: string;
  weight: number; // 1-10 importance scale
}

export interface TripPreferences {
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    min: number; // days
    max: number; // days
  };
  groupSize: number;
  preferredCountries: string[];
  excludedCountries: string[];
  entertainmentPreferences: UserPreference[];
  musicGenres: string[];
  sportsInterests: string[];
  culturalInterests: string[];
}

class UserPreferencesStore {
  preferences: TripPreferences = {
    budget: {
      min: 500,
      max: 3000,
      currency: 'USD'
    },
    duration: {
      min: 3,
      max: 7
    },
    groupSize: 1,
    preferredCountries: [],
    excludedCountries: [],
    entertainmentPreferences: [],
    musicGenres: [],
    sportsInterests: [],
    culturalInterests: []
  };

  isLoading = false;
  lastUpdated?: Date;
  spotifyConnected = false;
  fteWasPresented = false;
  searchDateRange = {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 4 months from now
  };
  spotifyProfile?: {
    id: string;
    displayName: string;
    topGenres: string[];
    topArtists: string[];
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Budget actions
  setBudgetRange(min: number, max: number, currency = 'USD') {
    this.preferences.budget = { min, max, currency };
    this.updateTimestamp();
  }

  // Duration actions
  setDurationRange(min: number, max: number) {
    this.preferences.duration = { min, max };
    this.updateTimestamp();
  }



  // Countries actions
  addPreferredCountry(country: string) {
    if (!this.preferences.preferredCountries.includes(country)) {
      this.preferences.preferredCountries.push(country);
      this.updateTimestamp();
    }
  }

  removePreferredCountry(country: string) {
    this.preferences.preferredCountries = this.preferences.preferredCountries.filter(c => c !== country);
    this.updateTimestamp();
  }

  addExcludedCountry(country: string) {
    if (!this.preferences.excludedCountries.includes(country)) {
      this.preferences.excludedCountries.push(country);
      this.updateTimestamp();
    }
  }

  removeExcludedCountry(country: string) {
    this.preferences.excludedCountries = this.preferences.excludedCountries.filter(c => c !== country);
    this.updateTimestamp();
  }

  // Entertainment preferences actions
  addEntertainmentPreference(preference: UserPreference) {
    const existingIndex = this.preferences.entertainmentPreferences.findIndex(p => p.id === preference.id);
    if (existingIndex >= 0) {
      this.preferences.entertainmentPreferences[existingIndex] = preference;
    } else {
      this.preferences.entertainmentPreferences.push(preference);
    }
    this.updateTimestamp();
  }

  removeEntertainmentPreference(id: string) {
    this.preferences.entertainmentPreferences = this.preferences.entertainmentPreferences.filter(p => p.id !== id);
    this.updateTimestamp();
  }

  // Music preferences actions
  setMusicGenres(genres: string[]) {
    this.preferences.musicGenres = genres;
    this.updateTimestamp();
  }

  addMusicGenre(genre: string) {
    if (!this.preferences.musicGenres.includes(genre)) {
      this.preferences.musicGenres.push(genre);
      this.updateTimestamp();
    }
  }

  // Sports preferences actions
  setSportsInterests(sports: string[]) {
    this.preferences.sportsInterests = sports;
    this.updateTimestamp();
  }

  addSportsInterest(sport: string) {
    if (!this.preferences.sportsInterests.includes(sport)) {
      this.preferences.sportsInterests.push(sport);
      this.updateTimestamp();
    }
  }

  // Group size action
  setGroupSize(size: number) {
    this.preferences.groupSize = Math.max(1, size);
    this.updateTimestamp();
  }

  // FTE actions
  setFteWasPresented(presented: boolean) {
    this.fteWasPresented = presented;
    this.updateTimestamp();
  }

  // Search date range actions
  setSearchDateRange(startDate: string, endDate: string) {
    this.searchDateRange = { startDate, endDate };
    this.updateTimestamp();
  }

  // Spotify integration actions
  setSpotifyConnection(connected: boolean, profile?: UserPreferencesStore['spotifyProfile']) {
    console.log('🎵 [STORE] setSpotifyConnection called:', { connected, profile: !!profile });
    console.log('🎵 [STORE] Previous state:', { spotifyConnected: this.spotifyConnected });
    this.spotifyConnected = connected;
    this.spotifyProfile = profile;
    console.log('🎵 [STORE] New state:', { spotifyConnected: this.spotifyConnected });
    if (profile?.topGenres) {
      this.setMusicGenres(profile.topGenres);
    }
    this.updateTimestamp();
    console.log('🎵 [STORE] setSpotifyConnection completed');
  }

  // Loading state actions
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // Utility actions
  private updateTimestamp() {
    this.lastUpdated = new Date();
  }

  reset() {
    this.preferences = {
      budget: { min: 500, max: 3000, currency: 'USD' },
      duration: { min: 3, max: 7 },
      groupSize: 1,
      preferredCountries: [],
      excludedCountries: [],
      entertainmentPreferences: [],
      musicGenres: [],
      sportsInterests: [],
      culturalInterests: []
    };
    this.spotifyConnected = false;
    this.spotifyProfile = undefined;
    this.lastUpdated = undefined;
    this.fteWasPresented = false;
    this.searchDateRange = {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
  }

  // Computed values
  get hasPreferences() {
    return this.preferences.preferredCountries.length > 0 || 
           this.preferences.entertainmentPreferences.length > 0 ||
           this.preferences.musicGenres.length > 0 ||
           this.preferences.sportsInterests.length > 0;
  }

  get preferenceSummary() {
    return {
      countries: this.preferences.preferredCountries.length,
      entertainments: this.preferences.entertainmentPreferences.length,
      musicGenres: this.preferences.musicGenres.length,
      sportsInterests: this.preferences.sportsInterests.length,
      budgetRange: `${this.preferences.budget.currency} ${this.preferences.budget.min}-${this.preferences.budget.max}`,
      duration: `${this.preferences.duration.min}-${this.preferences.duration.max} days`
    };
  }


}

export default UserPreferencesStore;
