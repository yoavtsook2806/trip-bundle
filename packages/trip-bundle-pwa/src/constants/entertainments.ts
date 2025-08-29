import { Entertainment } from '../types';

export const MUSIC_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'concert-pop',
    name: 'Pop Concert',
    category: 'music',
    subcategory: 'concert',
    description: 'Live pop music performances by popular artists',
    averageDuration: 3,
    averageCost: { min: 50, max: 300, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['US', 'GB', 'DE', 'FR', 'AU']
  },
  {
    id: 'concert-rock',
    name: 'Rock Concert',
    category: 'music',
    subcategory: 'concert',
    description: 'High-energy rock music performances',
    averageDuration: 4,
    averageCost: { min: 60, max: 250, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['US', 'GB', 'DE', 'AU', 'CA']
  },
  {
    id: 'festival-music',
    name: 'Music Festival',
    category: 'music',
    subcategory: 'festival',
    description: 'Multi-day music festivals with various artists',
    averageDuration: 24,
    averageCost: { min: 200, max: 800, currency: 'USD' },
    seasonality: 'summer',
    popularCountries: ['US', 'GB', 'NL', 'BE', 'ES']
  },
  {
    id: 'opera-classical',
    name: 'Opera Performance',
    category: 'music',
    subcategory: 'classical',
    description: 'Classical opera performances in historic venues',
    averageDuration: 3.5,
    averageCost: { min: 40, max: 200, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['IT', 'AT', 'DE', 'FR', 'GB']
  }
];

export const SPORTS_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'football-soccer',
    name: 'Football Match',
    category: 'sports',
    subcategory: 'football',
    description: 'Professional soccer/football matches',
    averageDuration: 2,
    averageCost: { min: 30, max: 200, currency: 'USD' },
    seasonality: 'seasonal',
    popularCountries: ['ES', 'GB', 'IT', 'DE', 'FR']
  },
  {
    id: 'basketball-nba',
    name: 'Basketball Game',
    category: 'sports',
    subcategory: 'basketball',
    description: 'Professional basketball games',
    averageDuration: 3,
    averageCost: { min: 50, max: 400, currency: 'USD' },
    seasonality: 'seasonal',
    popularCountries: ['US', 'CA', 'ES', 'GR']
  },
  {
    id: 'tennis-tournament',
    name: 'Tennis Tournament',
    category: 'sports',
    subcategory: 'tennis',
    description: 'Professional tennis tournaments and matches',
    averageDuration: 4,
    averageCost: { min: 25, max: 500, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['GB', 'FR', 'AU', 'US']
  },
  {
    id: 'formula1-race',
    name: 'Formula 1 Race',
    category: 'sports',
    subcategory: 'motorsport',
    description: 'Formula 1 Grand Prix racing events',
    averageDuration: 8,
    averageCost: { min: 100, max: 1000, currency: 'USD' },
    seasonality: 'seasonal',
    popularCountries: ['MC', 'IT', 'GB', 'DE', 'JP']
  }
];

export const CULTURAL_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'museum-art',
    name: 'Art Museum',
    category: 'culture',
    subcategory: 'museum',
    description: 'World-class art museums and galleries',
    averageDuration: 3,
    averageCost: { min: 15, max: 30, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['FR', 'US', 'GB', 'IT', 'ES']
  },
  {
    id: 'theater-broadway',
    name: 'Theater Show',
    category: 'culture',
    subcategory: 'theater',
    description: 'Broadway and West End theater productions',
    averageDuration: 2.5,
    averageCost: { min: 50, max: 300, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['US', 'GB', 'CA', 'AU']
  },
  {
    id: 'historic-sites',
    name: 'Historic Sites',
    category: 'culture',
    subcategory: 'heritage',
    description: 'UNESCO World Heritage sites and historic landmarks',
    averageDuration: 4,
    averageCost: { min: 10, max: 50, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['IT', 'GR', 'EG', 'PE', 'CN']
  }
];

export const NIGHTLIFE_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'nightclub-dancing',
    name: 'Nightclub',
    category: 'nightlife',
    subcategory: 'club',
    description: 'Premium nightclubs with DJs and dancing',
    averageDuration: 6,
    averageCost: { min: 20, max: 100, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['ES', 'DE', 'NL', 'US', 'GB']
  },
  {
    id: 'rooftop-bar',
    name: 'Rooftop Bar',
    category: 'nightlife',
    subcategory: 'bar',
    description: 'Scenic rooftop bars with city views',
    averageDuration: 3,
    averageCost: { min: 30, max: 80, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['US', 'TH', 'SG', 'AU', 'ES']
  }
];

export const FOOD_ENTERTAINMENTS: Entertainment[] = [
  {
    id: 'fine-dining',
    name: 'Fine Dining Experience',
    category: 'food',
    subcategory: 'restaurant',
    description: 'Michelin-starred and high-end restaurants',
    averageDuration: 3,
    averageCost: { min: 100, max: 500, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['FR', 'JP', 'US', 'IT', 'ES']
  },
  {
    id: 'food-tour',
    name: 'Food Tour',
    category: 'food',
    subcategory: 'tour',
    description: 'Guided culinary tours exploring local cuisine',
    averageDuration: 4,
    averageCost: { min: 50, max: 150, currency: 'USD' },
    seasonality: 'year-round',
    popularCountries: ['IT', 'TH', 'VN', 'MX', 'IN']
  }
];

export const ALL_ENTERTAINMENTS = [
  ...MUSIC_ENTERTAINMENTS,
  ...SPORTS_ENTERTAINMENTS,
  ...CULTURAL_ENTERTAINMENTS,
  ...NIGHTLIFE_ENTERTAINMENTS,
  ...FOOD_ENTERTAINMENTS
];

export const ENTERTAINMENT_CATEGORIES = [
  'music',
  'sports', 
  'culture',
  'food',
  'nature',
  'nightlife',
  'adventure'
] as const;

export const getEntertainmentsByCategory = (category: string): Entertainment[] => {
  return ALL_ENTERTAINMENTS.filter(entertainment => entertainment.category === category);
};

export const getEntertainmentsByCountry = (countryCode: string): Entertainment[] => {
  return ALL_ENTERTAINMENTS.filter(entertainment => 
    entertainment.popularCountries.includes(countryCode)
  );
};

export const searchEntertainments = (query: string): Entertainment[] => {
  const lowercaseQuery = query.toLowerCase();
  return ALL_ENTERTAINMENTS.filter(entertainment =>
    entertainment.name.toLowerCase().includes(lowercaseQuery) ||
    entertainment.description.toLowerCase().includes(lowercaseQuery) ||
    entertainment.subcategory.toLowerCase().includes(lowercaseQuery)
  );
};
