import { makeAutoObservable } from 'mobx';
import type { UserData, UserPreferences } from 'trip-bundle-prompts-service';

class UserPreferencesStore {
  userData: UserData = {
    userPreferences: {
      interestTypes: {
        concerts: { isEnabled: false },
        sports: { isEnabled: false },
        artDesign: { isEnabled: false },
        localCulture: { isEnabled: false },
        culinary: { isEnabled: false }
      },
      musicProfile: '',
      freeTextInterests: ''
    },
    dateRange: {
      startDate: Date.now(),
      endDate: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  };

  isLoading = false;
  lastUpdated?: Date;
  spotifyConnected = false;
  spotifyProfile?: {
    id: string;
    displayName: string;
    topGenres: string[];
    topArtists: string[];
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Interest types actions
  setInterestEnabled(interestType: keyof UserPreferences['interestTypes'], enabled: boolean) {
    this.userData.userPreferences.interestTypes[interestType].isEnabled = enabled;
    this.updateTimestamp();
  }

  // Music profile actions
  setMusicProfile(profile: string) {
    this.userData.userPreferences.musicProfile = profile;
    this.updateTimestamp();
  }

  // Free text interests actions
  setFreeTextInterests(interests: string) {
    this.userData.userPreferences.freeTextInterests = interests;
    this.updateTimestamp();
  }

  // Date range actions
  setDateRange(startDate: number, endDate: number) {
    this.userData.dateRange.startDate = startDate;
    this.userData.dateRange.endDate = endDate;
    this.updateTimestamp();
  }

  // Spotify integration actions
  setSpotifyConnection(connected: boolean, profile?: UserPreferencesStore['spotifyProfile']) {
    console.log('🎵 [STORE] setSpotifyConnection called:', { connected, profile: !!profile });
    this.spotifyConnected = connected;
    this.spotifyProfile = profile;
    
    if (profile?.topGenres && profile.topGenres.length > 0) {
      // Update music profile with Spotify data
      const genreText = `I enjoy ${profile.topGenres.slice(0, 3).join(', ')} music`;
      this.setMusicProfile(genreText);
    }
    
    this.updateTimestamp();
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
    this.userData = {
      userPreferences: {
        interestTypes: {
          concerts: { isEnabled: false },
          sports: { isEnabled: false },
          artDesign: { isEnabled: false },
          localCulture: { isEnabled: false },
          culinary: { isEnabled: false }
        },
        musicProfile: '',
        freeTextInterests: ''
      },
      dateRange: {
        startDate: Date.now(),
        endDate: Date.now() + (7 * 24 * 60 * 60 * 1000)
      }
    };
    this.spotifyConnected = false;
    this.spotifyProfile = undefined;
    this.lastUpdated = undefined;
  }

  // Computed values
  get hasPreferences() {
    const interests = Object.values(this.userData.userPreferences.interestTypes);
    const hasEnabledInterests = interests.some(interest => interest.isEnabled);
    const hasMusicProfile = this.userData.userPreferences.musicProfile.trim().length > 0;
    const hasFreeTextInterests = this.userData.userPreferences.freeTextInterests.trim().length > 0;
    
    return hasEnabledInterests || hasMusicProfile || hasFreeTextInterests;
  }

  get preferenceSummary() {
    const enabledInterests = Object.entries(this.userData.userPreferences.interestTypes)
      .filter(([_, interest]) => interest.isEnabled)
      .map(([key, _]) => key);
    
    return {
      interests: enabledInterests.length,
      musicProfile: this.userData.userPreferences.musicProfile ? 'Set' : 'Not set',
      freeTextInterests: this.userData.userPreferences.freeTextInterests ? 'Set' : 'Not set',
      dateRange: `${new Date(this.userData.dateRange.startDate).toLocaleDateString()} - ${new Date(this.userData.dateRange.endDate).toLocaleDateString()}`
    };
  }

  // Backward compatibility getter
  get preferences() {
    return this.userData.userPreferences;
  }
}

export default UserPreferencesStore;