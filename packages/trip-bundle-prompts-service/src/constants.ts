// =============================================================================
// CONSTANTS FOR TRIP BUNDLE PROMPTS SERVICE
// =============================================================================

import { Entertainment } from './types';

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
