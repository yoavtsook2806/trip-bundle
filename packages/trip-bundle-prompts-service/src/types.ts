export interface Event {
  interestType: keyof InterestTypes;
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
  city: string;
  startDate: string;
  endDate: string;
  events: Event[];
  subEvents: Event[];
}

// GPT Service Response Type
export interface GPTResponse {
  bundles: TripBundle[];
}

// =============================================================================
// USER DATA TYPES (Input to the service)
// =============================================================================

// Interest Type Configuration
export interface InterestType {
  isEnabled: boolean;
}

export interface InterestTypes {
  concerts: InterestType;
  sports: InterestType;
  artDesign: InterestType;
  localCulture: InterestType;
  culinary: InterestType;
}

// User Preferences (simplified for the service)
export interface UserPreferences {
  interestTypes: {
    concerts: InterestType;
    sports: InterestType;
    artDesign: InterestType;
    localCulture: InterestType;
    culinary: InterestType;
  };
  musicProfile: string;
  freeTextInterests: string;
}

// Date Range Type
export interface DateRange {
  startDate: number;
  endDate: number;
}

// User Data Input Type (what the service receives)
export interface UserData {
  userPreferences: UserPreferences;
  dateRange: DateRange;
}

// Generation Options
export interface GenerationOptions {
  from?: number;
  to?: number;
}

// Service Interface
// Simplified service interface - just a single function
export type GenerateTripBundlesFunction = (
  userData: UserData,
  isMock?: boolean,
  options?: GenerationOptions
) => Promise<GPTResponse>;