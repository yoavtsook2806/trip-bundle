export interface DateRange {
  startDate: number; //timestamp
  endDate: number; //timestamp
}

export interface Event {
title: string;
fullDescription: string;
shortDescription: string;
interestType: 'concerts' | 'sports' | 'artDesign' | 'localCulture' | 'culinary';
dateRange: DateRange;
eventWebsite?: string;
}

export interface TripBundle {
imageUrl: string;
title: string;
description: string;
city: string;
dateRange: DateRange;
keyEvents: Event[];
minorEvents: Event[];
}

export interface GPTResponse {
bundles: TripBundle[];
}// =============================================================================
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