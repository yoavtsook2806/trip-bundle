import { makeAutoObservable } from 'mobx';
import type { TripBundle } from 'trip-bundle-prompts-service';

export interface BundleSuggestionsState {
  bundles: TripBundle[];
  isLoading: boolean;
  error: string | null;
  lastGenerated: Date | null;
  selectedBundle: TripBundle | null;
  bookmarkedBundles: string[]; // bundle IDs
  pagination: {
    currentPage: number;
    hasMore: boolean;
    total: number;
    isLoadingMore: boolean;
  };
}

class BundleSuggestionsStore {
  bundles: TripBundle[] = [];
  isLoading = false;
  error: string | null = null;
  lastGenerated: Date | null = null;
  selectedBundle: TripBundle | null = null;
  bookmarkedBundles: string[] = [];
  pagination = {
    currentPage: 0,
    hasMore: true,
    total: 0,
    isLoadingMore: false
  };

  constructor() {
    makeAutoObservable(this);
    // Load bookmarked bundles from localStorage
    this.loadBookmarksFromStorage();
  }

  // Loading state actions
  setLoading(loading: boolean) {
    this.isLoading = loading;
    if (loading) {
      this.error = null;
    }
  }

  setError(error: string | null) {
    this.error = error;
    this.isLoading = false;
  }

  // Bundle management actions
  setBundles(bundles: TripBundle[], paginationInfo?: { page: number; total: number; hasMore: boolean }, append = false) {
    if (append) {
      // Append new bundles (for pagination)
      this.bundles = [...this.bundles, ...bundles];
    } else {
      // Replace all bundles (for initial load)
      this.bundles = bundles;
    }
    
    if (paginationInfo) {
      this.pagination.currentPage = paginationInfo.page;
      this.pagination.total = paginationInfo.total;
      this.pagination.hasMore = paginationInfo.hasMore;
    }
    
    this.lastGenerated = new Date();
    this.isLoading = false;
    this.pagination.isLoadingMore = false;
    this.error = null;
  }

  addBundle(bundle: TripBundle) {
    const existingIndex = this.bundles.findIndex(b => b.id === bundle.id);
    if (existingIndex >= 0) {
      this.bundles[existingIndex] = bundle;
    } else {
      this.bundles.push(bundle);
    }
    this.lastGenerated = new Date();
  }

  removeBundle(bundleId: string) {
    this.bundles = this.bundles.filter(bundle => bundle.id !== bundleId);
    if (this.selectedBundle?.id === bundleId) {
      this.selectedBundle = null;
    }
    this.removeBookmark(bundleId);
  }

  clearBundles() {
    this.bundles = [];
    this.selectedBundle = null;
    this.error = null;
    this.lastGenerated = null;
    this.pagination = {
      currentPage: 0,
      hasMore: true,
      total: 0,
      isLoadingMore: false
    };
  }

  // Pagination actions
  setLoadingMore(loading: boolean) {
    this.pagination.isLoadingMore = loading;
    if (loading) {
      this.error = null;
    }
  }

  get canLoadMore(): boolean {
    return this.pagination.hasMore && !this.pagination.isLoadingMore && !this.isLoading;
  }

  get nextPage(): number {
    return this.pagination.currentPage + 1;
  }

  // Selection actions
  selectBundle(bundle: TripBundle | null) {
    this.selectedBundle = bundle;
  }

  selectBundleById(bundleId: string) {
    const bundle = this.bundles.find(b => b.id === bundleId);
    this.selectedBundle = bundle || null;
  }

  // Bookmark actions
  toggleBookmark(bundleId: string) {
    if (this.isBookmarked(bundleId)) {
      this.removeBookmark(bundleId);
    } else {
      this.addBookmark(bundleId);
    }
  }

  addBookmark(bundleId: string) {
    if (!this.bookmarkedBundles.includes(bundleId)) {
      this.bookmarkedBundles.push(bundleId);
      this.saveBookmarksToStorage();
    }
  }

  removeBookmark(bundleId: string) {
    this.bookmarkedBundles = this.bookmarkedBundles.filter(id => id !== bundleId);
    this.saveBookmarksToStorage();
  }

  isBookmarked(bundleId: string): boolean {
    return this.bookmarkedBundles.includes(bundleId);
  }

  // Utility actions
  refreshBundles() {
    // This could trigger a new API call
    this.setLoading(true);
  }

  // Computed properties
  get hasBundles(): boolean {
    return this.bundles.length > 0;
  }

  get bundleCount(): number {
    return this.bundles.length;
  }

  get bookmarkedBundlesList(): TripBundle[] {
    return this.bundles.filter(bundle => this.isBookmarked(bundle.id));
  }

  get highConfidenceBundles(): TripBundle[] {
    return this.bundles.filter(bundle => bundle.confidence >= 80);
  }

  get sortedBundlesByConfidence(): TripBundle[] {
    return [...this.bundles].sort((a, b) => b.confidence - a.confidence);
  }

  get averageConfidence(): number {
    if (this.bundles.length === 0) return 0;
    const total = this.bundles.reduce((sum, bundle) => sum + bundle.confidence, 0);
    return Math.round(total / this.bundles.length);
  }

  get totalBudgetRange(): { min: number; max: number; currency: string } | null {
    if (this.bundles.length === 0) return null;
    
    const amounts = this.bundles.map(bundle => bundle.totalCost.amount);
    const currency = this.bundles[0]?.totalCost.currency || 'USD';
    
    return {
      min: Math.min(...amounts),
      max: Math.max(...amounts),
      currency
    };
  }

  get bundlesByCountry(): Record<string, TripBundle[]> {
    return this.bundles.reduce((acc, bundle) => {
      const country = bundle.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(bundle);
      return acc;
    }, {} as Record<string, TripBundle[]>);
  }

  // Search and filter methods
  searchBundles(query: string): TripBundle[] {
    const lowercaseQuery = query.toLowerCase();
    return this.bundles.filter(bundle =>
      bundle.title.toLowerCase().includes(lowercaseQuery) ||
      bundle.description.toLowerCase().includes(lowercaseQuery) ||
      bundle.city.toLowerCase().includes(lowercaseQuery) ||
      bundle.country.toLowerCase().includes(lowercaseQuery) ||
      bundle.events.some(ent => 
        ent.entertainment.name.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  filterBundlesByBudget(maxBudget: number): TripBundle[] {
    return this.bundles.filter(bundle => bundle.totalCost.amount <= maxBudget);
  }

  filterBundlesByCountry(country: string): TripBundle[] {
    return this.bundles.filter(bundle => bundle.country === country);
  }

  filterBundlesByDuration(minDays: number, maxDays: number): TripBundle[] {
    return this.bundles.filter(bundle => 
      bundle.duration >= minDays && bundle.duration <= maxDays
    );
  }

  filterBundlesByEntertainmentCategory(category: string): TripBundle[] {
    return this.bundles.filter(bundle =>
      bundle.events.some(ent => ent.entertainment.category === category)
    );
  }

  // Storage methods
  private saveBookmarksToStorage() {
    try {
      localStorage.setItem('trip_bundle_bookmarks', JSON.stringify(this.bookmarkedBundles));
    } catch (error) {
      console.warn('Failed to save bookmarks to localStorage:', error);
    }
  }

  private loadBookmarksFromStorage() {
    try {
      const stored = localStorage.getItem('trip_bundle_bookmarks');
      if (stored) {
        this.bookmarkedBundles = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load bookmarks from localStorage:', error);
      this.bookmarkedBundles = [];
    }
  }

  // Persistence methods for bundles
  saveBundlesToStorage() {
    try {
      const bundlesData = {
        bundles: this.bundles,
        lastGenerated: this.lastGenerated,
        selectedBundleId: this.selectedBundle?.id || null
      };
      localStorage.setItem('trip_bundle_suggestions', JSON.stringify(bundlesData));
    } catch (error) {
      console.warn('Failed to save bundles to localStorage:', error);
    }
  }

  loadBundlesFromStorage() {
    try {
      const stored = localStorage.getItem('trip_bundle_suggestions');
      if (stored) {
        const bundlesData = JSON.parse(stored);
        this.bundles = bundlesData.bundles || [];
        this.lastGenerated = bundlesData.lastGenerated ? new Date(bundlesData.lastGenerated) : null;
        
        if (bundlesData.selectedBundleId) {
          this.selectBundleById(bundlesData.selectedBundleId);
        }
      }
    } catch (error) {
      console.warn('Failed to load bundles from localStorage:', error);
    }
  }

  clearStorage() {
    try {
      localStorage.removeItem('trip_bundle_suggestions');
      localStorage.removeItem('trip_bundle_bookmarks');
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  // Statistics
  get statistics() {
    return {
      totalBundles: this.bundleCount,
      bookmarkedCount: this.bookmarkedBundles.length,
      averageConfidence: this.averageConfidence,
      highConfidenceCount: this.highConfidenceBundles.length,
      uniqueCountries: new Set(this.bundles.map(b => b.country)).size,
      uniqueCities: new Set(this.bundles.map(b => b.city)).size,
      budgetRange: this.totalBudgetRange,
      lastGenerated: this.lastGenerated
    };
  }
}

export default BundleSuggestionsStore;
