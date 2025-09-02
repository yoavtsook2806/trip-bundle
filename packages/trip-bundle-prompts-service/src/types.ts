export interface Event {
  title: string;
  interestType: keyof InterestTypes;
  date: number;
  venue: string;
  bookingUrl?: string;
}

export interface EventsData {
    title: string;
    events: Event[]
}

// Trip Bundle Type
export interface TripBundle {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  city: string;
  startDate: number; // timestamp
  endDate: number; // timestamp
  keyEvents: EventsData;
  minorEvents: EventsData;
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

// Service Interface
// Simplified service interface - just a single function
export type GenerateTripBundlesFunction = (
  userData: UserData,
  isMock?: boolean,
  existingBundles?: TripBundle[]
) => Promise<GPTResponse>;