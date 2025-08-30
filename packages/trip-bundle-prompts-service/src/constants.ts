// =============================================================================
// CONSTANTS FOR TRIP BUNDLE PROMPTS SERVICE
// =============================================================================

import { Entertainment } from './types';

// City data (simplified for the service)
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

// Sample cities (you can expand this list)
export const CITIES: City[] = [
  {
    code: 'PAR',
    name: 'Paris',
    country: 'France',
    countryCode: 'FR',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['French'],
    flagUrl: 'https://flagcdn.com/w320/fr.png',
    symbolUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'LON',
    name: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    continent: 'Europe',
    currency: 'GBP',
    timeZone: 'GMT',
    language: ['English'],
    flagUrl: 'https://flagcdn.com/w320/gb.png',
    symbolUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'ROM',
    name: 'Rome',
    country: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Italian'],
    flagUrl: 'https://flagcdn.com/w320/it.png',
    symbolUrl: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'MAD',
    name: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Spanish'],
    flagUrl: 'https://flagcdn.com/w320/es.png',
    symbolUrl: 'https://images.unsplash.com/photo-1543785734-4b6e564642f8?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'BER',
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['German'],
    flagUrl: 'https://flagcdn.com/w320/de.png',
    symbolUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'AMS',
    name: 'Amsterdam',
    country: 'Netherlands',
    countryCode: 'NL',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Dutch'],
    flagUrl: 'https://flagcdn.com/w320/nl.png',
    symbolUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=250&fit=crop&auto=format'
  }
];

// Entertainment types (sample data)
export const ALL_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'concert-pop',
    name: 'Pop Concert',
    category: 'music',
    subcategory: 'concert',
    description: 'Live pop music performance',
    averageDuration: 3,
    averageCost: { min: 50, max: 300, currency: 'EUR' },
    seasonality: 'year-round',
    popularCountries: ['US', 'GB', 'FR', 'DE']
  },
  {
    id: 'football-match',
    name: 'Football Match',
    category: 'sports',
    subcategory: 'football',
    description: 'Professional football match',
    averageDuration: 2,
    averageCost: { min: 30, max: 200, currency: 'EUR' },
    seasonality: 'seasonal',
    popularCountries: ['GB', 'ES', 'IT', 'DE', 'FR']
  },
  {
    id: 'art-exhibition',
    name: 'Art Exhibition',
    category: 'culture',
    subcategory: 'exhibition',
    description: 'Contemporary or classical art exhibition',
    averageDuration: 2,
    averageCost: { min: 15, max: 50, currency: 'EUR' },
    seasonality: 'year-round',
    popularCountries: ['FR', 'IT', 'GB', 'US', 'DE']
  },
  {
    id: 'food-festival',
    name: 'Food Festival',
    category: 'food',
    subcategory: 'festival',
    description: 'Local cuisine and food tasting event',
    averageDuration: 4,
    averageCost: { min: 20, max: 80, currency: 'EUR' },
    seasonality: 'seasonal',
    popularCountries: ['IT', 'FR', 'ES', 'TH', 'JP']
  },
  {
    id: 'jazz-club',
    name: 'Jazz Club',
    category: 'music',
    subcategory: 'jazz',
    description: 'Intimate jazz performance venue',
    averageDuration: 3,
    averageCost: { min: 25, max: 80, currency: 'EUR' },
    seasonality: 'year-round',
    popularCountries: ['US', 'FR', 'GB', 'DE']
  },
  {
    id: 'theater-show',
    name: 'Theater Show',
    category: 'culture',
    subcategory: 'theater',
    description: 'Live theatrical performance',
    averageDuration: 3,
    averageCost: { min: 40, max: 150, currency: 'EUR' },
    seasonality: 'year-round',
    popularCountries: ['GB', 'US', 'FR', 'DE']
  }
];
