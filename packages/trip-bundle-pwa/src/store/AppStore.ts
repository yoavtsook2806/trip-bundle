import { makeAutoObservable } from 'mobx';
import { 
  AppState, 
  TripBundle, 
  UserPreferences, 
  DateRange, 
  PromptsUsage 
} from '../types';
import { getDefaultUserPreferences } from '../storage';

export class AppStore {
  currentScreen: AppState['currentScreen'] = 'firstTime';
  isLoading: boolean = false;
  bundles: TripBundle[] = [];
  selectedBundle: TripBundle | null = null;
  bundlesLoaded: number = 0;
  maxBundles: number = 10;
  userPreferences: UserPreferences | null = null;
  dateRange: DateRange | null = null;
  promptsUsage: PromptsUsage = {
    count: 0,
    date: new Date().toISOString().split('T')[0],
    maxDaily: 10
  };

  constructor() {
    makeAutoObservable(this);
  }

  // Screen navigation
  setCurrentScreen(screen: AppState['currentScreen']) {
    this.currentScreen = screen;
  }

  // Loading state
  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // Bundles management
  setBundles(bundles: TripBundle[]) {
    this.bundles = bundles;
    this.bundlesLoaded = bundles.length;
  }

  addBundles(bundles: TripBundle[]) {
    this.bundles = [...this.bundles, ...bundles];
    this.bundlesLoaded = this.bundles.length;
  }

  setSelectedBundle(bundle: TripBundle | null) {
    this.selectedBundle = bundle;
  }

  // User preferences
  setUserPreferences(preferences: UserPreferences) {
    this.userPreferences = preferences;
  }

  setDateRange(dateRange: DateRange) {
    this.dateRange = dateRange;
  }

  // Prompts usage
  setPromptsUsage(usage: PromptsUsage) {
    this.promptsUsage = usage;
  }

  // Reset all data (for local storage reset)
  resetAll() {
    this.currentScreen = 'firstTime';
    this.isLoading = false;
    this.bundles = [];
    this.selectedBundle = null;
    this.bundlesLoaded = 0;
    this.userPreferences = getDefaultUserPreferences();
    this.dateRange = null;
    this.promptsUsage = {
      count: 0,
      date: new Date().toISOString().split('T')[0],
      maxDaily: 10
    };
  }

  // Computed values
  get hasCompletedSetup() {
    if (!this.userPreferences || !this.dateRange) return false;
    const hasInterests = Object.values(this.userPreferences.interestTypes).some(
      (interest: any) => interest.isEnabled
    );
    return hasInterests;
  }

  get canMakePromptCall() {
    return this.promptsUsage.count < this.promptsUsage.maxDaily;
  }

  get canLoadMore() {
    return this.bundlesLoaded < this.maxBundles && this.canMakePromptCall;
  }
}
