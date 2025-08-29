export interface Country {
  code: string;
  name: string;
  continent: string;
  currency: string;
  popularCities: string[];
  timeZone: string;
  language: string[];
}

export const COUNTRIES: Country[] = [
  // Europe
  {
    code: 'FR',
    name: 'France',
    continent: 'Europe',
    currency: 'EUR',
    popularCities: ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],
    timeZone: 'CET',
    language: ['French']
  },
  {
    code: 'IT',
    name: 'Italy',
    continent: 'Europe',
    currency: 'EUR',
    popularCities: ['Rome', 'Milan', 'Venice', 'Florence', 'Naples'],
    timeZone: 'CET',
    language: ['Italian']
  },
  {
    code: 'ES',
    name: 'Spain',
    continent: 'Europe',
    currency: 'EUR',
    popularCities: ['Madrid', 'Barcelona', 'Seville', 'Valencia', 'Bilbao'],
    timeZone: 'CET',
    language: ['Spanish']
  },
  {
    code: 'DE',
    name: 'Germany',
    continent: 'Europe',
    currency: 'EUR',
    popularCities: ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt'],
    timeZone: 'CET',
    language: ['German']
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    continent: 'Europe',
    currency: 'GBP',
    popularCities: ['London', 'Edinburgh', 'Manchester', 'Liverpool', 'Birmingham'],
    timeZone: 'GMT',
    language: ['English']
  },
  {
    code: 'NL',
    name: 'Netherlands',
    continent: 'Europe',
    currency: 'EUR',
    popularCities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven'],
    timeZone: 'CET',
    language: ['Dutch']
  },

  // North America
  {
    code: 'US',
    name: 'United States',
    continent: 'North America',
    currency: 'USD',
    popularCities: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco', 'Las Vegas', 'Boston'],
    timeZone: 'Multiple',
    language: ['English']
  },
  {
    code: 'CA',
    name: 'Canada',
    continent: 'North America',
    currency: 'CAD',
    popularCities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
    timeZone: 'Multiple',
    language: ['English', 'French']
  },
  {
    code: 'MX',
    name: 'Mexico',
    continent: 'North America',
    currency: 'MXN',
    popularCities: ['Mexico City', 'Cancun', 'Guadalajara', 'Monterrey', 'Puerto Vallarta'],
    timeZone: 'Multiple',
    language: ['Spanish']
  },

  // Asia
  {
    code: 'JP',
    name: 'Japan',
    continent: 'Asia',
    currency: 'JPY',
    popularCities: ['Tokyo', 'Osaka', 'Kyoto', 'Hiroshima', 'Yokohama'],
    timeZone: 'JST',
    language: ['Japanese']
  },
  {
    code: 'KR',
    name: 'South Korea',
    continent: 'Asia',
    currency: 'KRW',
    popularCities: ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Jeju'],
    timeZone: 'KST',
    language: ['Korean']
  },
  {
    code: 'CN',
    name: 'China',
    continent: 'Asia',
    currency: 'CNY',
    popularCities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Xi\'an'],
    timeZone: 'CST',
    language: ['Chinese']
  },
  {
    code: 'TH',
    name: 'Thailand',
    continent: 'Asia',
    currency: 'THB',
    popularCities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi'],
    timeZone: 'ICT',
    language: ['Thai']
  },
  {
    code: 'SG',
    name: 'Singapore',
    continent: 'Asia',
    currency: 'SGD',
    popularCities: ['Singapore'],
    timeZone: 'SGT',
    language: ['English', 'Chinese', 'Malay', 'Tamil']
  },

  // Oceania
  {
    code: 'AU',
    name: 'Australia',
    continent: 'Oceania',
    currency: 'AUD',
    popularCities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
    timeZone: 'Multiple',
    language: ['English']
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    continent: 'Oceania',
    currency: 'NZD',
    popularCities: ['Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga'],
    timeZone: 'NZST',
    language: ['English']
  },

  // South America
  {
    code: 'BR',
    name: 'Brazil',
    continent: 'South America',
    currency: 'BRL',
    popularCities: ['São Paulo', 'Rio de Janeiro', 'Salvador', 'Brasília', 'Fortaleza'],
    timeZone: 'Multiple',
    language: ['Portuguese']
  },
  {
    code: 'AR',
    name: 'Argentina',
    continent: 'South America',
    currency: 'ARS',
    popularCities: ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata'],
    timeZone: 'ART',
    language: ['Spanish']
  },
  {
    code: 'CL',
    name: 'Chile',
    continent: 'South America',
    currency: 'CLP',
    popularCities: ['Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta'],
    timeZone: 'CLT',
    language: ['Spanish']
  }
];

export const CONTINENTS = [
  'Europe',
  'North America',
  'Asia',
  'Oceania',
  'South America',
  'Africa'
];

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountriesByContinent = (continent: string): Country[] => {
  return COUNTRIES.filter(country => country.continent === continent);
};

export const searchCountries = (query: string): Country[] => {
  const lowercaseQuery = query.toLowerCase();
  return COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(lowercaseQuery) ||
    country.popularCities.some(city => city.toLowerCase().includes(lowercaseQuery))
  );
};
