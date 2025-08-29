// =============================================================================
// CORE TYPES - Trip Bundle PWA
// =============================================================================

// City Type
export interface City {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  continent: string;
  currency: string;
  timeZone: string;
  language: string[];
  flagUrl: string;
  symbolUrl: string;
}

// Entertainment Type
export interface Entertainment {
  id: string;
  name: string;
  category: 'music' | 'sports' | 'culture' | 'food' | 'nature' | 'nightlife' | 'adventure';
  subcategory?: string;
  description: string;
  averageDuration?: number; // in hours
  duration?: number; // in minutes (for compatibility)
  averageCost?: {
    min: number;
    max: number;
    currency: string;
  };
  seasonality?: 'year-round' | 'seasonal' | 'summer' | 'winter' | 'limited' | 'exclusive' | 'anniversary' | 'annual';
  popularCountries?: string[]; // country codes
  tags?: string[];
}

// Event Type (for individual events)
export interface Event {
  entertainment: Entertainment;
  date: string;
  time: string;
  venue: string;
  cost: number;
  currency: string;
  bookingUrl?: string;
}

// Event Details Data (for EventDetails component)
export interface EventDetailsData {
  entertainment: Entertainment;
  date: string;
  time: string;
  venue: string;
  cost: number;
  currency: string;
  bookingUrl?: string;
}


// Trip Bundle Type
export interface TripBundle {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  totalCost: {
    amount: number;
    currency: string;
    breakdown: {
      accommodation: number;
      entertainment: number;
      food: number;
      transport: number;
    };
  };
  entertainments: Event[];
  accommodation: {
    name: string;
    type: 'hotel' | 'hostel' | 'apartment' | 'resort';
    rating: number;
    pricePerNight: number;
    location: string;
    amenities: string[];
  };
  transportation: {
    type: 'flight' | 'train' | 'bus' | 'car';
    details: string;
    cost: number;
    currency: string;
  };
  recommendations: {
    restaurants: string[];
    localTips: string[];
    weatherInfo: string;
    packingList: string[];
  };
  confidence: number; // 0-100 how well it matches user preferences
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

// GPT Service Response Type
export interface GPTResponse {
  bundles: TripBundle[];
  reasoning: string;
  alternatives: string[];
  processingTime: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Events Search Response Type
export interface EventsResponse {
  events: Event[];
  reasoning: string;
  processingTime: number;
}

// =============================================================================
// USER PREFERENCES TYPES
// =============================================================================

export interface UserPreferences {
  budget?: {
    min: number;
    max: number;
    currency: string;
  };
  duration?: {
    min: number;
    max: number;
  };
  preferredCategories?: Entertainment['category'][];
  preferredCountries?: string[];
  travelStyle?: 'budget' | 'mid-range' | 'luxury';
  groupSize?: number;
  accessibility?: boolean;
  languages?: string[];
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

// Tab Navigation
export interface Tab {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

// Bundle Offer Props
export interface BundleOfferProps {
  bundle: TripBundle;
  onSelect?: (bundle: TripBundle) => void;
  onBookmark?: (bundle: TripBundle) => void;
  onEventClick?: (entertainment: Entertainment, date: string, time: string, venue: string, cost: number) => void;
  isSelected?: boolean;
  isBookmarked?: boolean;
}

// Event Details Props
export interface EventDetailsProps {
  event: EventDetailsData;
  onClose?: () => void;
  onBook?: (event: EventDetailsData) => void;
}

// Search Form Props
export interface SearchFormProps {
  onSearch: (city: string, startDate: string, endDate: string) => void;
  isLoading?: boolean;
}

// =============================================================================
// STORE TYPES
// =============================================================================

export interface BundleSuggestionsState {
  bundles: TripBundle[];
  isLoading: boolean;
  error: string | null;
  selectedBundle: TripBundle | null;
  bookmarkedBundleIds: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface UserPreferencesState extends UserPreferences {
  isLoaded: boolean;
}
