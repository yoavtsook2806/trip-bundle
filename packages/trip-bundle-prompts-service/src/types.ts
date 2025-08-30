// =============================================================================
// TRIP BUNDLE PROMPTS SERVICE TYPES
// =============================================================================

// City data structure
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

// Core Entertainment Type
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
  events: Event[];
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
// USER DATA TYPES (Input to the service)
// =============================================================================

// User Preferences (simplified for the service)
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
  musicGenres?: string[];
  sportsInterests?: string[];
  entertainmentPreferences?: Array<{
    value: string;
    type: string;
    weight: number;
  }>;
  travelDates?: {
    flexible?: boolean;
  };
}

// Integration Summary Type
export interface IntegrationSummary {
  summary: string;
}

// User Data Input Type (what the service receives)
export interface UserData {
  userPreferences: UserPreferences;
  integrations: {
    [integrationName: string]: IntegrationSummary;
  };
}

// =============================================================================
// SERVICE CONFIGURATION TYPES
// =============================================================================

export interface ServiceConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Generation Options
export interface GenerationOptions {
  page?: number;
  limit?: number;
}

// Service Interface
export interface ITripBundleService {
  updateUserData(userData: UserData): void;
  generateTripBundles(options?: GenerationOptions): Promise<GPTResponse>;
  getEvents(city: string, startDate: string, endDate: string): Promise<EventsResponse>;
  isConfigured(): boolean;
}
