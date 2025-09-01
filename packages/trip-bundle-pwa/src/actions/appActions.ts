import { generateTripBundles, TripBundle } from 'trip-bundle-prompts-service';
import { appStore } from '../store';
import { 
  UserPreferences, 
  DateRange, 
  UserData 
} from '../types';
import {
  getUserPreferences,
  saveUserPreferences,
  getDateRange,
  saveDateRange,
  hasCompletedFirstTimeSetup,
  getPromptsUsage,
  incrementPromptsUsage,
  canMakePromptCall,
  resetPromptsUsage
} from '../storage';

/**
 * Initialize app state from storage
 */
export const initializeApp = () => {
  console.log('🚀 Initializing app from storage...');
  
  const preferences = getUserPreferences();
  const dateRange = getDateRange();
  const hasSetup = hasCompletedFirstTimeSetup();
  const promptsUsage = getPromptsUsage();

  appStore.setUserPreferences(preferences);
  if (dateRange) {
    appStore.setDateRange(dateRange);
  }
  appStore.setPromptsUsage(promptsUsage);
  appStore.setCurrentScreen(hasSetup ? 'bundles' : 'firstTime');
  
  console.log('✅ App initialized', { hasSetup, promptsUsage });
};

/**
 * Generate trip bundles using the service and update store
 */
export const generateBundles = async (
  preferences: UserPreferences, 
  dateRange: DateRange,
  isMock: boolean = true,
  existingBundles: TripBundle[] = []
) => {
  if (!canMakePromptCall()) {
    console.warn('❌ Daily prompt limit reached');
    return;
  }

  console.log('🎯 Starting bundle generation...', { preferences, dateRange, isMock });
  
  appStore.setCurrentScreen('thinking');
  appStore.setLoading(true);

  try {
    const userData: UserData = {
      userPreferences: preferences,
      dateRange: dateRange
    };

    const response = await generateTripBundles(userData, isMock, existingBundles);
    
    // Update usage counter
    const newUsage = incrementPromptsUsage();
    appStore.setPromptsUsage(newUsage);
    
    // Update store with results
    appStore.setBundles(response.bundles);
    appStore.setCurrentScreen('bundles');
    
    console.log('✅ Bundles generated successfully', { 
      bundleCount: response.bundles.length,
      newUsage 
    });
    
  } catch (error) {
    console.error('❌ Error generating bundles:', error);
    appStore.setCurrentScreen('bundles');
  } finally {
    appStore.setLoading(false);
  }
};

/**
 * Complete first-time setup
 */
export const completeFirstTimeSetup = async (
  preferences: UserPreferences, 
  dateRange: DateRange,
  isMock: boolean = true
) => {
  console.log('🎯 Completing first-time setup...', { preferences, dateRange });
  
  // Save to storage
  saveUserPreferences(preferences);
  saveDateRange(dateRange);
  
  // Update store
  appStore.setUserPreferences(preferences);
  appStore.setDateRange(dateRange);
  
  // Generate bundles
  await generateBundles(preferences, dateRange, isMock);
};

/**
 * Update user preferences and regenerate bundles
 */
export const updatePreferences = async (
  preferences: UserPreferences, 
  dateRange: DateRange,
  isMock: boolean = true
) => {
  console.log('💾 Updating preferences...', { preferences, dateRange });
  
  // Save to storage
  saveUserPreferences(preferences);
  saveDateRange(dateRange);
  
  // Update store
  appStore.setUserPreferences(preferences);
  appStore.setDateRange(dateRange);
  
  // Generate new bundles
  await generateBundles(preferences, dateRange, isMock);
};

/**
 * Navigate to different screens
 */
export const navigateToScreen = (screen: typeof appStore.currentScreen) => {
  console.log('🧭 Navigating to screen:', screen);
  appStore.setCurrentScreen(screen);
};

/**
 * Select a bundle for detailed view
 */
export const selectBundle = (bundle: typeof appStore.selectedBundle) => {
  console.log('📋 Selecting bundle:', bundle?.id);
  appStore.setSelectedBundle(bundle);
  if (bundle) {
    appStore.setCurrentScreen('bundlePage');
  }
};

/**
 * Reset all local storage and return to first-time experience
 */
export const resetLocalStorage = () => {
  console.log('🗑️ Resetting all local storage...');
  
  // Clear all localStorage
  localStorage.clear();
  
  // Reset prompts usage specifically
  resetPromptsUsage();
  
  // Reset store to initial state
  appStore.resetAll();
  
  console.log('✅ Local storage reset complete - returning to first-time experience');
};

/**
 * Load more bundles (pagination)
 */
export const loadMoreBundles = async (isMock: boolean = true) => {
  if (!appStore.canLoadMore) {
    console.warn('❌ Cannot load more bundles - limit reached or no API calls remaining');
    return;
  }

  if (!appStore.userPreferences || !appStore.dateRange) {
    console.warn('❌ Cannot load more bundles - no user preferences or date range');
    return;
  }

  console.log('📄 Loading more bundles...', { 
    currentCount: appStore.bundlesLoaded,
    maxBundles: appStore.maxBundles 
  });

  appStore.setLoading(true);

  try {
    // Pass existing bundles to avoid duplicates
    const existingBundles = appStore.bundles;

    const userData: UserData = {
      userPreferences: appStore.userPreferences,
      dateRange: appStore.dateRange
    };

    const response = await generateTripBundles(userData, isMock, existingBundles);
    
    // Update usage counter
    const newUsage = incrementPromptsUsage();
    appStore.setPromptsUsage(newUsage);
    
    // Add new bundles to existing ones
    appStore.addBundles(response.bundles);
    
    console.log('✅ More bundles loaded successfully', { 
      newBundles: response.bundles.length,
      totalBundles: appStore.bundles.length,
      newUsage 
    });
    
  } catch (error) {
    console.error('❌ Error loading more bundles:', error);
  } finally {
    appStore.setLoading(false);
  }
};

/**
 * Generate new bundles (for refresh after page reload)
 */
export const generateNewBundles = async (isMock: boolean = true) => {
  if (!appStore.userPreferences || !appStore.dateRange) {
    console.warn('❌ Cannot generate new bundles - no user preferences or date range');
    return;
  }

  console.log('🔄 Generating new bundles from stored preferences...');
  await generateBundles(appStore.userPreferences, appStore.dateRange, isMock);
};

/**
 * Refresh prompts usage from storage
 */
export const refreshPromptsUsage = () => {
  const usage = getPromptsUsage();
  appStore.setPromptsUsage(usage);
  console.log('🔄 Prompts usage refreshed:', usage);
};
