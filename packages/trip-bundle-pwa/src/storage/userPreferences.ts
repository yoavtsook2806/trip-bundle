import { UserPreferences, DateRange } from '../types';

const USER_PREFERENCES_KEY = 'trip-bundle-user-preferences';
const DATE_RANGE_KEY = 'trip-bundle-date-range';

/**
 * Get default user preferences
 */
export const getDefaultUserPreferences = (): UserPreferences => ({
  interestTypes: {
    concerts: { isEnabled: false },
    sports: { isEnabled: false },
    artDesign: { isEnabled: false },
    localCulture: { isEnabled: false },
    culinary: { isEnabled: false }
  },
  musicProfile: '',
  freeTextInterests: ''
});

/**
 * Get user preferences from storage
 */
export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(USER_PREFERENCES_KEY);
  
  if (!stored) {
    return getDefaultUserPreferences();
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultUserPreferences();
  }
};

/**
 * Save user preferences to storage
 */
export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
};

/**
 * Get date range from storage
 */
export const getDateRange = (): DateRange | null => {
  const stored = localStorage.getItem(DATE_RANGE_KEY);
  
  if (!stored) {
    return null;
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

/**
 * Save date range to storage
 */
export const saveDateRange = (dateRange: DateRange): void => {
  localStorage.setItem(DATE_RANGE_KEY, JSON.stringify(dateRange));
};

/**
 * Check if user has completed first-time setup
 */
export const hasCompletedFirstTimeSetup = (): boolean => {
  const preferences = getUserPreferences();
  const dateRange = getDateRange();
  
  // Check if at least one interest is enabled and date range is set
  const hasInterests = Object.values(preferences.interestTypes).some((interest: any) => interest.isEnabled);
  
  return hasInterests && dateRange !== null;
};
