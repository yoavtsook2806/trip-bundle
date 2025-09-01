import UserPreferencesStore from '../store/userPreferences';
import { UserDataStorage, UserDataHelpers } from '../storage/userPreferences';
import type { UserData } from '../storage/userPreferences';

export class UserPreferencesActions {
  constructor(
    private userPreferencesStore: UserPreferencesStore,
    private userPreferencesStorage = UserDataStorage
  ) {}

  // =============================================================================
  // STORAGE ACTIONS
  // =============================================================================

  /**
   * Save user data to storage
   */
  async saveUserData(userData: UserData): Promise<boolean> {
    console.log('💾 [USER_PREFS_ACTIONS] Saving user data:', userData);
    const success = await this.userPreferencesStorage.setUserData(userData);
    
    if (success) {
      // Update the store with the saved data
      this.userPreferencesStore.userData = userData;
      console.log('✅ [USER_PREFS_ACTIONS] User data saved successfully');
    } else {
      console.error('❌ [USER_PREFS_ACTIONS] Failed to save user data');
    }
    
    return success;
  }

  /**
   * Load user data from storage
   */
  async loadUserData(): Promise<UserData> {
    return this.userPreferencesStorage.getUserData();
  }

  /**
   * Check if user has preferences
   */
  async hasUserData(): Promise<boolean> {
    return UserDataHelpers.hasPreferences();
  }

  /**
   * Clear all user preferences
   */
  async clearUserData(): Promise<boolean> {
    console.log('🗑️ [USER_PREFS_ACTIONS] Clearing user data');
    const success = await this.userPreferencesStorage.clearUserData();
    
    if (success) {
      this.userPreferencesStore.reset();
      console.log('✅ [USER_PREFS_ACTIONS] User data cleared successfully');
    } else {
      console.error('❌ [USER_PREFS_ACTIONS] Failed to clear user data');
    }
    
    return success;
  }

  // =============================================================================
  // STORE ACTIONS (for immediate UI updates)
  // =============================================================================

  /**
   * Set interest enabled/disabled
   */
  setInterestEnabled(interestType: keyof UserData['userPreferences']['interestTypes'], enabled: boolean) {
    console.log(`🎯 [USER_PREFS_ACTIONS] Setting ${interestType} to ${enabled}`);
    this.userPreferencesStore.setInterestEnabled(interestType, enabled);
  }

  /**
   * Set music profile
   */
  setMusicProfile(profile: string) {
    console.log('🎵 [USER_PREFS_ACTIONS] Setting music profile:', profile);
    this.userPreferencesStore.setMusicProfile(profile);
  }

  /**
   * Set free text interests
   */
  setFreeTextInterests(interests: string) {
    console.log('📝 [USER_PREFS_ACTIONS] Setting free text interests:', interests);
    this.userPreferencesStore.setFreeTextInterests(interests);
  }

  /**
   * Set date range
   */
  setDateRange(startDate: number, endDate: number) {
    console.log('📅 [USER_PREFS_ACTIONS] Setting date range:', { startDate, endDate });
    this.userPreferencesStore.setDateRange(startDate, endDate);
  }

  // =============================================================================
  // INITIALIZATION
  // =============================================================================

  /**
   * Initialize preferences from storage
   */
  async initializeFromStorage(userPreferencesStore: UserPreferencesStore): Promise<void> {
    console.log('🚀 [USER_PREFS_ACTIONS] Initializing preferences from storage');
    
    try {
      const hasStoredData = await UserDataHelpers.hasPreferences();
      
      if (hasStoredData) {
        console.log('📦 [USER_PREFS_ACTIONS] Found stored user data, loading...');
        const userData = await this.userPreferencesStorage.getUserData();
        
        // Update the store with loaded data
        userPreferencesStore.userData = userData;
        
        console.log('✅ [USER_PREFS_ACTIONS] Preferences initialized from storage');
      } else {
        console.log('📝 [USER_PREFS_ACTIONS] No stored preferences found, using defaults');
      }
    } catch (error) {
      console.error('❌ [USER_PREFS_ACTIONS] Error initializing preferences:', error);
    }
  }
}

export default UserPreferencesActions;