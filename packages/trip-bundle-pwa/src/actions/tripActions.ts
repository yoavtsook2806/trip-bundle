import BundleSuggestionsStore from '../store/bundleSuggestions';
import UserPreferencesStore from '../store/userPreferences';

import { createTripBundleService } from '../services/tripBundleServiceFactory';
import { CITIES } from '../constants/cities';
import type { TripBundle, ITripBundleService } from 'trip-bundle-prompts-service';

export class TripActions {
  private bundleSuggestionsStore: BundleSuggestionsStore;
  private userPreferencesStore: UserPreferencesStore;

  private tripBundleService: ITripBundleService;

  constructor(
    bundleSuggestionsStore: BundleSuggestionsStore,
    userPreferencesStore: UserPreferencesStore
  ) {
    this.bundleSuggestionsStore = bundleSuggestionsStore;
    this.userPreferencesStore = userPreferencesStore;
    
    // Create the appropriate service based on environment
    const userData = userPreferencesStore.userData;
    const cities = CITIES.map(city => city.name);
    this.tripBundleService = createTripBundleService(userData, cities);
  }

  // Trip Bundle Generation Actions

  async generateTripBundles(loadMore = false): Promise<void> {
    try {
      if (loadMore) {
        this.bundleSuggestionsStore.setLoadingMore(true);
      } else {
        this.bundleSuggestionsStore.setLoading(true);
        this.bundleSuggestionsStore.clearBundles(); // Clear existing bundles for fresh load
      }

      if (!this.tripBundleService.isConfigured()) {
        console.warn('Trip bundle service not configured');
      }

      // Update service with latest user data
      const userData = this.userPreferencesStore.userData;
      this.tripBundleService.updateUserData(userData);
      
      // Determine page to load
      const page = loadMore ? this.bundleSuggestionsStore.nextPage : 1;
      const limit = 5; // Always load 5 bundles per page
      
      console.log(`Generating trip bundles - Page: ${page}, Limit: ${limit}, LoadMore: ${loadMore}`);

      const response = await this.tripBundleService.generateTripBundles({ page, limit });
      
      // Save the bundles to the store
      const paginationInfo = response.pagination ? {
        page: response.pagination.page,
        total: response.pagination.total,
        hasMore: response.pagination.hasMore
      } : undefined;
      
      this.bundleSuggestionsStore.setBundles(response.bundles, paginationInfo, loadMore);
      this.bundleSuggestionsStore.saveBundlesToStorage();
      
    } catch (error) {
      console.error('Failed to generate trip bundle:', error);
      this.bundleSuggestionsStore.setError('Failed to generate trip bundle. Please try again.');
    }
  }

  async loadMoreBundles(): Promise<void> {
    if (!this.bundleSuggestionsStore.canLoadMore) {
      console.log('Cannot load more bundles - already loading or no more available');
      return;
    }
    
    return this.generateTripBundles(true);
  }



  // Bundle Suggestion Actions
  selectBundle(bundle: TripBundle | null): void {
    this.bundleSuggestionsStore.selectBundle(bundle);
  }

  toggleBookmark(bundleId: string): void {
    this.bundleSuggestionsStore.toggleBookmark(bundleId);
  }

  clearBundles(): void {
    this.bundleSuggestionsStore.clearBundles();
  }

  retryGeneration(): void {
    this.generateTripBundles();
  }





  // Utility methods - Bundle Suggestions
  getBundles(): TripBundle[] {
    return this.bundleSuggestionsStore.bundles;
  }

  isBundlesLoading(): boolean {
    return this.bundleSuggestionsStore.isLoading;
  }

  getBundlesError(): string | null {
    return this.bundleSuggestionsStore.error;
  }

  hasBundles(): boolean {
    return this.bundleSuggestionsStore.hasBundles;
  }

  isLoadingMore(): boolean {
    return this.bundleSuggestionsStore.pagination.isLoadingMore;
  }

  canLoadMore(): boolean {
    return this.bundleSuggestionsStore.canLoadMore;
  }

  getPaginationInfo() {
    return {
      currentPage: this.bundleSuggestionsStore.pagination.currentPage,
      total: this.bundleSuggestionsStore.pagination.total,
      hasMore: this.bundleSuggestionsStore.pagination.hasMore,
      isLoadingMore: this.bundleSuggestionsStore.pagination.isLoadingMore
    };
  }

  getSelectedBundle(): TripBundle | null {
    return this.bundleSuggestionsStore.selectedBundle;
  }

  isBookmarked(bundleId: string): boolean {
    return this.bundleSuggestionsStore.isBookmarked(bundleId);
  }

  getBundleStatistics() {
    return this.bundleSuggestionsStore.statistics;
  }
}

export default TripActions;
