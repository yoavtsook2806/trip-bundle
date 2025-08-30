import type { City } from 'trip-bundle-prompts-service';

export const CITIES: City[] = [
  // Western Europe Capital Cities
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
  },
  {
    code: 'BRU',
    name: 'Brussels',
    country: 'Belgium',
    countryCode: 'BE',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Dutch', 'French'],
    flagUrl: 'https://flagcdn.com/w320/be.png',
    symbolUrl: 'https://images.unsplash.com/photo-1559564484-0b8b2d7d1635?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'VIE',
    name: 'Vienna',
    country: 'Austria',
    countryCode: 'AT',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['German'],
    flagUrl: 'https://flagcdn.com/w320/at.png',
    symbolUrl: 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'LIS',
    name: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'WET',
    language: ['Portuguese'],
    flagUrl: 'https://flagcdn.com/w320/pt.png',
    symbolUrl: 'https://images.unsplash.com/photo-1588640203724-b4e8d3b8e7b8?w=400&h=250&fit=crop&auto=format'
  },
  // Nordic Capital Cities
  {
    code: 'STO',
    name: 'Stockholm',
    country: 'Sweden',
    countryCode: 'SE',
    continent: 'Europe',
    currency: 'SEK',
    timeZone: 'CET',
    language: ['Swedish'],
    flagUrl: 'https://flagcdn.com/w320/se.png',
    symbolUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'OSL',
    name: 'Oslo',
    country: 'Norway',
    countryCode: 'NO',
    continent: 'Europe',
    currency: 'NOK',
    timeZone: 'CET',
    language: ['Norwegian'],
    flagUrl: 'https://flagcdn.com/w320/no.png',
    symbolUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'COP',
    name: 'Copenhagen',
    country: 'Denmark',
    countryCode: 'DK',
    continent: 'Europe',
    currency: 'DKK',
    timeZone: 'CET',
    language: ['Danish'],
    flagUrl: 'https://flagcdn.com/w320/dk.png',
    symbolUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'HEL',
    name: 'Helsinki',
    country: 'Finland',
    countryCode: 'FI',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'EET',
    language: ['Finnish'],
    flagUrl: 'https://flagcdn.com/w320/fi.png',
    symbolUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=250&fit=crop&auto=format'
  },
  // Eastern Europe Capital Cities
  {
    code: 'WAR',
    name: 'Warsaw',
    country: 'Poland',
    countryCode: 'PL',
    continent: 'Europe',
    currency: 'PLN',
    timeZone: 'CET',
    language: ['Polish'],
    flagUrl: 'https://flagcdn.com/w320/pl.png',
    symbolUrl: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'PRA',
    name: 'Prague',
    country: 'Czech Republic',
    countryCode: 'CZ',
    continent: 'Europe',
    currency: 'CZK',
    timeZone: 'CET',
    language: ['Czech'],
    flagUrl: 'https://flagcdn.com/w320/cz.png',
    symbolUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'BUD',
    name: 'Budapest',
    country: 'Hungary',
    countryCode: 'HU',
    continent: 'Europe',
    currency: 'HUF',
    timeZone: 'CET',
    language: ['Hungarian'],
    flagUrl: 'https://flagcdn.com/w320/hu.png',
    symbolUrl: 'https://images.unsplash.com/photo-1518604666860-f6b2b5c8ce1a?w=400&h=250&fit=crop&auto=format'
  },
  // Southern Europe
  {
    code: 'ATH',
    name: 'Athens',
    country: 'Greece',
    countryCode: 'GR',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'EET',
    language: ['Greek'],
    flagUrl: 'https://flagcdn.com/w320/gr.png',
    symbolUrl: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'ZAG',
    name: 'Zagreb',
    country: 'Croatia',
    countryCode: 'HR',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Croatian'],
    flagUrl: 'https://flagcdn.com/w320/hr.png',
    symbolUrl: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'DUB',
    name: 'Dublin',
    country: 'Ireland',
    countryCode: 'IE',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'GMT',
    language: ['English', 'Irish'],
    flagUrl: 'https://flagcdn.com/w320/ie.png',
    symbolUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=400&h=250&fit=crop&auto=format'
  },
  // Major Non-Capital Cities
  {
    code: 'BCN',
    name: 'Barcelona',
    country: 'Spain',
    countryCode: 'ES',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Spanish', 'Catalan'],
    flagUrl: 'https://flagcdn.com/w320/es.png',
    symbolUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'MIL',
    name: 'Milan',
    country: 'Italy',
    countryCode: 'IT',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['Italian'],
    flagUrl: 'https://flagcdn.com/w320/it.png',
    symbolUrl: 'https://images.unsplash.com/photo-1543832923-44667a44c804?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'MUN',
    name: 'Munich',
    country: 'Germany',
    countryCode: 'DE',
    continent: 'Europe',
    currency: 'EUR',
    timeZone: 'CET',
    language: ['German'],
    flagUrl: 'https://flagcdn.com/w320/de.png',
    symbolUrl: 'https://images.unsplash.com/photo-1595867818082-083862f3d630?w=400&h=250&fit=crop&auto=format'
  },
  {
    code: 'ZUR',
    name: 'Zurich',
    country: 'Switzerland',
    countryCode: 'CH',
    continent: 'Europe',
    currency: 'CHF',
    timeZone: 'CET',
    language: ['German'],
    flagUrl: 'https://flagcdn.com/w320/ch.png',
    symbolUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&auto=format'
  }
];

export default CITIES;
