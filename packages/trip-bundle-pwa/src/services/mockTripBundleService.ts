// =============================================================================
// MOCK TRIP BUNDLE SERVICE - Simple Function for Development
// =============================================================================

import { 
  type UserData,
  type GPTResponse,
  type GenerationOptions,
  type GenerateTripBundlesFunction
} from 'trip-bundle-prompts-service';
import { PromptsTokenStorage } from '../storage/userPreferences';

/**
 * Mock function that provides sample data for development
 * Implements the same interface as the real generateTripBundles function
 */
export const mockGenerateTripBundles: GenerateTripBundlesFunction = async (
  userData: UserData,
  _cities: string[],
  options: GenerationOptions = {}
): Promise<GPTResponse> => {
  const { page = 1, limit = 5 } = options;

  console.log(`🎭 Using mock data (VITE_MOCK=true) - Page ${page}, Limit ${limit}`);
  console.log(`👤 User preferences:`, userData.userPreferences);
  console.log(`📅 Date range:`, userData.dateRange);
  
  // Increment API call counter (only for page 1 - new searches)
  if (page === 1) {
    const { allowed, remaining } = await PromptsTokenStorage.incrementCall();
    console.log(`📊 API call incremented: ${10 - remaining}/10 calls used`);
    
    if (!allowed) {
      throw new Error('Daily API limit reached (10/10 calls). Please try again tomorrow.');
    }
  }
  
  // Simulate API delay (2 seconds for better UX)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return simple mock data
  const mockBundles = [
    {
      id: 'paris-jazz-2024',
      title: 'Paris Jazz Festival Weekend',
      description: 'Experience world-class jazz in the City of Light with premium venue access.',
      city: 'Paris',
      country: 'France',
      startDate: '2024-10-15',
      endDate: '2024-10-17',
      duration: 3,
      totalCost: 850,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
      events: [
        {
          id: 'paris-jazz-main',
          title: 'Paris Jazz Festival - Main Stage',
          description: 'Opening night featuring international jazz legends',
          date: '2024-10-15',
          time: '20:00',
          venue: 'Le Duc des Lombards',
          cost: 85,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'paris-food-tour',
          title: 'Paris Food Tour',
          description: 'Discover French culinary delights',
          date: '2024-10-16',
          time: '10:00',
          venue: 'Paris Food District',
          cost: 45,
          currency: 'EUR'
        },
        {
          id: 'louvre-visit',
          title: 'Louvre Museum Visit',
          description: 'Explore world-famous art collections',
          date: '2024-10-17',
          time: '14:00',
          venue: 'Louvre Museum',
          cost: 20,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel des Grands Boulevards',
        type: 'hotel',
        rating: 4.5,
        pricePerNight: 180,
        location: 'Grands Boulevards',
        amenities: ['Free WiFi', 'Breakfast', 'Jazz Bar']
      },
      transportation: {
        type: 'flight',
        cost: 200,
        currency: 'EUR',
        details: 'Round-trip flight to Paris'
      },
      recommendations: [
        'Book jazz venues in advance',
        'Try local French cuisine',
        'Visit during evening for best atmosphere'
      ],
      confidence: 0.9
    },
    {
      id: 'tokyo-culture-2024',
      title: 'Tokyo Cultural Immersion',
      description: 'Experience authentic Japanese culture and traditions.',
      city: 'Tokyo',
      country: 'Japan',
      startDate: '2024-10-10',
      endDate: '2024-10-14',
      duration: 5,
      totalCost: 1200,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
      events: [
        {
          id: 'sumo-tournament',
          title: 'Grand Sumo Tournament',
          description: 'Witness the ancient sport of sumo wrestling',
          date: '2024-10-12',
          time: '16:00',
          venue: 'Ryogoku Kokugikan',
          cost: 120,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'tokyo-food-tour',
          title: 'Tokyo Food Tour',
          description: 'Discover authentic Japanese cuisine',
          date: '2024-10-11',
          time: '10:00',
          venue: 'Tokyo Food District',
          cost: 45,
          currency: 'EUR'
        },
        {
          id: 'temple-visit',
          title: 'Traditional Temple Visit',
          description: 'Experience spiritual Japanese culture',
          date: '2024-10-13',
          time: '14:00',
          venue: 'Senso-ji Temple',
          cost: 0,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Tokyo Grand Hotel',
        type: 'hotel',
        rating: 4.3,
        pricePerNight: 120,
        location: 'Shibuya',
        amenities: ['Free WiFi', 'Traditional Bath', 'City View']
      },
      transportation: {
        type: 'flight',
        cost: 800,
        currency: 'EUR',
        details: 'Round-trip flight to Tokyo'
      },
      recommendations: [
        'Learn basic Japanese phrases',
        'Respect local customs',
        'Try authentic sushi and ramen'
      ],
      confidence: 0.85
    },
    {
      id: 'london-theatre-2024',
      title: 'London West End Theatre Experience',
      description: 'Immerse yourself in London\'s world-famous theatre scene with premium shows.',
      city: 'London',
      country: 'United Kingdom',
      startDate: '2024-11-01',
      endDate: '2024-11-04',
      duration: 4,
      totalCost: 950,
      currency: 'GBP',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      events: [
        {
          id: 'phantom-opera',
          title: 'The Phantom of the Opera',
          description: 'Experience the longest-running musical in West End history',
          date: '2024-11-02',
          time: '19:30',
          venue: 'Her Majesty\'s Theatre',
          cost: 95,
          currency: 'GBP'
        }
      ],
      subEvents: [
        {
          id: 'british-museum',
          title: 'British Museum Tour',
          description: 'Explore world history and culture',
          date: '2024-11-01',
          time: '14:00',
          venue: 'British Museum',
          cost: 25,
          currency: 'GBP'
        }
      ],
      accommodation: {
        name: 'The Savoy London',
        type: 'hotel',
        rating: 4.8,
        pricePerNight: 220,
        location: 'Covent Garden',
        amenities: ['Luxury Spa', 'Fine Dining', 'Thames Views']
      },
      transportation: {
        type: 'train',
        cost: 180,
        currency: 'GBP',
        details: 'Eurostar from Paris to London'
      },
      recommendations: [
        'Book theatre tickets well in advance',
        'Try traditional afternoon tea',
        'Use the Underground for easy transport'
      ],
      confidence: 0.92
    },
    {
      id: 'barcelona-football-2024',
      title: 'Barcelona El Clásico Weekend',
      description: 'Witness the legendary El Clásico between Barcelona and Real Madrid.',
      city: 'Barcelona',
      country: 'Spain',
      startDate: '2024-10-26',
      endDate: '2024-10-28',
      duration: 3,
      totalCost: 750,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&h=600&fit=crop',
      events: [
        {
          id: 'el-clasico',
          title: 'FC Barcelona vs Real Madrid - El Clásico',
          description: 'The most anticipated match in football',
          date: '2024-10-27',
          time: '21:00',
          venue: 'Camp Nou',
          cost: 180,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'sagrada-familia',
          title: 'Sagrada Familia Tour',
          description: 'Visit Gaudí\'s architectural masterpiece',
          date: '2024-10-26',
          time: '11:00',
          venue: 'Sagrada Familia',
          cost: 35,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Casa Fuster',
        type: 'hotel',
        rating: 4.6,
        pricePerNight: 160,
        location: 'Gràcia',
        amenities: ['Rooftop Bar', 'Spa', 'City Views']
      },
      transportation: {
        type: 'flight',
        cost: 150,
        currency: 'EUR',
        details: 'Round-trip flight to Barcelona'
      },
      recommendations: [
        'Wear Barcelona colors to the match',
        'Try authentic tapas and paella',
        'Walk Las Ramblas'
      ],
      confidence: 0.88
    },
    {
      id: 'amsterdam-art-2024',
      title: 'Amsterdam Art & Culture Week',
      description: 'Explore Amsterdam\'s rich artistic heritage and vibrant cultural scene.',
      city: 'Amsterdam',
      country: 'Netherlands',
      startDate: '2024-11-08',
      endDate: '2024-11-12',
      duration: 5,
      totalCost: 680,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
      events: [
        {
          id: 'van-gogh-special',
          title: 'Van Gogh Museum Special Exhibition',
          description: 'Rare collection of Van Gogh\'s masterpieces',
          date: '2024-11-09',
          time: '10:00',
          venue: 'Van Gogh Museum',
          cost: 25,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'canal-cruise',
          title: 'Amsterdam Canal Cruise',
          description: 'Scenic tour through historic canals',
          date: '2024-11-08',
          time: '15:00',
          venue: 'Amsterdam Canals',
          cost: 18,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Lloyd Hotel Amsterdam',
        type: 'hotel',
        rating: 4.2,
        pricePerNight: 110,
        location: 'Eastern Docklands',
        amenities: ['Design Hotel', 'Restaurant', 'Cultural Events']
      },
      transportation: {
        type: 'train',
        cost: 85,
        currency: 'EUR',
        details: 'High-speed train from Brussels'
      },
      recommendations: [
        'Rent a bike to explore the city',
        'Visit the Anne Frank House',
        'Try Dutch cheese and stroopwafels'
      ],
      confidence: 0.86
    },
    {
      id: 'rome-history-2024',
      title: 'Rome Ancient History Adventure',
      description: 'Walk through 2,000 years of history in the Eternal City.',
      city: 'Rome',
      country: 'Italy',
      startDate: '2024-10-20',
      endDate: '2024-10-24',
      duration: 5,
      totalCost: 820,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
      events: [
        {
          id: 'colosseum-night',
          title: 'Colosseum Night Tour',
          description: 'Exclusive after-hours access to the Colosseum',
          date: '2024-10-21',
          time: '20:00',
          venue: 'Colosseum',
          cost: 55,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'vatican-museums',
          title: 'Vatican Museums & Sistine Chapel',
          description: 'Marvel at Renaissance masterpieces',
          date: '2024-10-22',
          time: '09:00',
          venue: 'Vatican Museums',
          cost: 35,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel de Russie',
        type: 'hotel',
        rating: 4.7,
        pricePerNight: 180,
        location: 'Via del Babuino',
        amenities: ['Luxury Garden', 'Spa', 'Fine Dining']
      },
      transportation: {
        type: 'flight',
        cost: 220,
        currency: 'EUR',
        details: 'Round-trip flight to Rome'
      },
      recommendations: [
        'Book skip-the-line tickets in advance',
        'Try authentic Roman pizza and gelato',
        'Throw a coin in the Trevi Fountain'
      ],
      confidence: 0.91
    },
    {
      id: 'vienna-classical-2024',
      title: 'Vienna Classical Music Festival',
      description: 'Experience the birthplace of classical music with world-class performances.',
      city: 'Vienna',
      country: 'Austria',
      startDate: '2024-11-15',
      endDate: '2024-11-18',
      duration: 4,
      totalCost: 720,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&h=600&fit=crop',
      events: [
        {
          id: 'vienna-philharmonic',
          title: 'Vienna Philharmonic Orchestra',
          description: 'World-renowned orchestra performance',
          date: '2024-11-16',
          time: '19:30',
          venue: 'Musikverein',
          cost: 120,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'schonbrunn-palace',
          title: 'Schönbrunn Palace Tour',
          description: 'Imperial palace and gardens',
          date: '2024-11-15',
          time: '14:00',
          venue: 'Schönbrunn Palace',
          cost: 28,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Sacher Wien',
        type: 'hotel',
        rating: 4.9,
        pricePerNight: 200,
        location: 'Innere Stadt',
        amenities: ['Historic Luxury', 'Original Sachertorte', 'Spa']
      },
      transportation: {
        type: 'train',
        cost: 95,
        currency: 'EUR',
        details: 'High-speed train from Munich'
      },
      recommendations: [
        'Dress formally for concert halls',
        'Try authentic Sachertorte',
        'Visit traditional Viennese coffee houses'
      ],
      confidence: 0.89
    },
    {
      id: 'berlin-nightlife-2024',
      title: 'Berlin Electronic Music Scene',
      description: 'Dive into Berlin\'s legendary nightlife and electronic music culture.',
      city: 'Berlin',
      country: 'Germany',
      startDate: '2024-11-22',
      endDate: '2024-11-25',
      duration: 4,
      totalCost: 550,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1587330979470-3016b6702d89?w=800&h=600&fit=crop',
      events: [
        {
          id: 'berghain-night',
          title: 'Berghain Club Night',
          description: 'Experience the world\'s most famous techno club',
          date: '2024-11-23',
          time: '00:00',
          venue: 'Berghain',
          cost: 25,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'berlin-wall-tour',
          title: 'Berlin Wall Memorial Tour',
          description: 'Learn about Germany\'s divided history',
          date: '2024-11-22',
          time: '11:00',
          venue: 'Berlin Wall Memorial',
          cost: 15,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Circus Hotel Berlin',
        type: 'hotel',
        rating: 4.1,
        pricePerNight: 95,
        location: 'Mitte',
        amenities: ['Modern Design', 'Rooftop Bar', 'Bike Rental']
      },
      transportation: {
        type: 'flight',
        cost: 120,
        currency: 'EUR',
        details: 'Round-trip flight to Berlin'
      },
      recommendations: [
        'Prepare for long club nights',
        'Try currywurst and döner kebab',
        'Use public transport extensively'
      ],
      confidence: 0.83
    },
    {
      id: 'prague-medieval-2024',
      title: 'Prague Medieval Christmas Markets',
      description: 'Experience the magic of Prague\'s medieval Christmas markets.',
      city: 'Prague',
      country: 'Czech Republic',
      startDate: '2024-12-01',
      endDate: '2024-12-04',
      duration: 4,
      totalCost: 480,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
      events: [
        {
          id: 'christmas-market',
          title: 'Old Town Square Christmas Market',
          description: 'Traditional Christmas market with crafts and mulled wine',
          date: '2024-12-02',
          time: '16:00',
          venue: 'Old Town Square',
          cost: 0,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'prague-castle',
          title: 'Prague Castle Tour',
          description: 'Explore the largest ancient castle complex',
          date: '2024-12-01',
          time: '10:00',
          venue: 'Prague Castle',
          cost: 20,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Golden Well',
        type: 'hotel',
        rating: 4.4,
        pricePerNight: 85,
        location: 'Lesser Town',
        amenities: ['Castle Views', 'Historic Building', 'Spa']
      },
      transportation: {
        type: 'bus',
        cost: 65,
        currency: 'EUR',
        details: 'Comfortable bus from Vienna'
      },
      recommendations: [
        'Try traditional Czech beer',
        'Walk across Charles Bridge at sunset',
        'Buy handmade Christmas ornaments'
      ],
      confidence: 0.87
    },
    {
      id: 'dublin-literary-2024',
      title: 'Dublin Literary Pub Crawl',
      description: 'Follow in the footsteps of Joyce, Wilde, and other Irish literary giants.',
      city: 'Dublin',
      country: 'Ireland',
      startDate: '2024-11-29',
      endDate: '2024-12-02',
      duration: 4,
      totalCost: 650,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&h=600&fit=crop',
      events: [
        {
          id: 'literary-pub-crawl',
          title: 'Dublin Literary Pub Crawl',
          description: 'Guided tour through Dublin\'s literary history',
          date: '2024-11-30',
          time: '19:30',
          venue: 'Temple Bar District',
          cost: 18,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'trinity-college',
          title: 'Trinity College & Book of Kells',
          description: 'Visit Ireland\'s oldest university and ancient manuscripts',
          date: '2024-11-29',
          time: '14:00',
          venue: 'Trinity College',
          cost: 16,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'The Shelbourne Hotel',
        type: 'hotel',
        rating: 4.5,
        pricePerNight: 140,
        location: 'St. Stephen\'s Green',
        amenities: ['Historic Luxury', 'Afternoon Tea', 'City Center']
      },
      transportation: {
        type: 'flight',
        cost: 180,
        currency: 'EUR',
        details: 'Round-trip flight to Dublin'
      },
      recommendations: [
        'Try authentic Irish stew and Guinness',
        'Listen to traditional Irish music',
        'Visit the Guinness Storehouse'
      ],
      confidence: 0.84
    },
    {
      id: 'lisbon-fado-2024',
      title: 'Lisbon Fado Music Experience',
      description: 'Immerse yourself in Portugal\'s soulful fado music tradition.',
      city: 'Lisbon',
      country: 'Portugal',
      startDate: '2024-12-08',
      endDate: '2024-12-11',
      duration: 4,
      totalCost: 580,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
      events: [
        {
          id: 'fado-restaurant',
          title: 'Traditional Fado Performance',
          description: 'Authentic fado music with Portuguese dinner',
          date: '2024-12-09',
          time: '21:00',
          venue: 'Clube de Fado',
          cost: 45,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'belem-tower',
          title: 'Belém Tower & Jerónimos Monastery',
          description: 'UNESCO World Heritage sites',
          date: '2024-12-08',
          time: '15:00',
          venue: 'Belém District',
          cost: 12,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Memmo Alfama Hotel',
        type: 'hotel',
        rating: 4.3,
        pricePerNight: 120,
        location: 'Alfama',
        amenities: ['River Views', 'Rooftop Terrace', 'Historic District']
      },
      transportation: {
        type: 'flight',
        cost: 160,
        currency: 'EUR',
        details: 'Round-trip flight to Lisbon'
      },
      recommendations: [
        'Try pastéis de nata (custard tarts)',
        'Ride the historic Tram 28',
        'Explore the colorful Alfama neighborhood'
      ],
      confidence: 0.88
    },
    {
      id: 'stockholm-design-2024',
      title: 'Stockholm Design Week',
      description: 'Discover Scandinavian design excellence in Sweden\'s capital.',
      city: 'Stockholm',
      country: 'Sweden',
      startDate: '2024-12-15',
      endDate: '2024-12-18',
      duration: 4,
      totalCost: 780,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&h=600&fit=crop',
      events: [
        {
          id: 'design-week-exhibition',
          title: 'Stockholm Design Week Exhibition',
          description: 'Latest trends in Scandinavian design',
          date: '2024-12-16',
          time: '11:00',
          venue: 'Stockholm Design Museum',
          cost: 25,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'gamla-stan-tour',
          title: 'Gamla Stan Old Town Tour',
          description: 'Medieval streets and royal palace',
          date: '2024-12-15',
          time: '14:00',
          venue: 'Gamla Stan',
          cost: 20,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Ett Hem Hotel',
        type: 'hotel',
        rating: 4.6,
        pricePerNight: 180,
        location: 'Östermalm',
        amenities: ['Design Hotel', 'Scandinavian Style', 'Garden']
      },
      transportation: {
        type: 'flight',
        cost: 200,
        currency: 'EUR',
        details: 'Round-trip flight to Stockholm'
      },
      recommendations: [
        'Try traditional Swedish meatballs',
        'Visit IKEA Museum',
        'Take a boat tour of the archipelago'
      ],
      confidence: 0.85
    },
    {
      id: 'copenhagen-hygge-2024',
      title: 'Copenhagen Hygge Experience',
      description: 'Embrace the Danish concept of hygge in one of the world\'s happiest cities.',
      city: 'Copenhagen',
      country: 'Denmark',
      startDate: '2024-12-22',
      endDate: '2024-12-26',
      duration: 5,
      totalCost: 920,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=600&fit=crop',
      events: [
        {
          id: 'tivoli-christmas',
          title: 'Tivoli Gardens Christmas Market',
          description: 'Magical Christmas atmosphere in historic amusement park',
          date: '2024-12-23',
          time: '17:00',
          venue: 'Tivoli Gardens',
          cost: 35,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'nyhavn-walk',
          title: 'Nyhavn Harbor Walk',
          description: 'Colorful harbor district and Hans Christian Andersen sites',
          date: '2024-12-22',
          time: '11:00',
          venue: 'Nyhavn',
          cost: 0,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel d\'Angleterre',
        type: 'hotel',
        rating: 4.8,
        pricePerNight: 220,
        location: 'City Center',
        amenities: ['Luxury Spa', 'Michelin Dining', 'Royal History']
      },
      transportation: {
        type: 'train',
        cost: 120,
        currency: 'EUR',
        details: 'Scenic train from Hamburg'
      },
      recommendations: [
        'Try smørrebrød (open sandwiches)',
        'Visit the Little Mermaid statue',
        'Experience Danish coffee culture'
      ],
      confidence: 0.90
    },
    {
      id: 'zurich-winter-2024',
      title: 'Zurich Winter Sports Weekend',
      description: 'Combine city culture with nearby Alpine skiing adventures.',
      city: 'Zurich',
      country: 'Switzerland',
      startDate: '2024-12-29',
      endDate: '2025-01-02',
      duration: 5,
      totalCost: 1150,
      currency: 'CHF',
      imageUrl: 'https://images.unsplash.com/photo-1527004760525-e4b8f0b4b3e2?w=800&h=600&fit=crop',
      events: [
        {
          id: 'skiing-day-trip',
          title: 'Skiing Day Trip to Flumserberg',
          description: 'Alpine skiing with stunning mountain views',
          date: '2024-12-30',
          time: '08:00',
          venue: 'Flumserberg Ski Resort',
          cost: 85,
          currency: 'CHF'
        }
      ],
      subEvents: [
        {
          id: 'swiss-national-museum',
          title: 'Swiss National Museum',
          description: 'Swiss cultural history and artifacts',
          date: '2024-12-29',
          time: '14:00',
          venue: 'Swiss National Museum',
          cost: 12,
          currency: 'CHF'
        }
      ],
      accommodation: {
        name: 'Baur au Lac Hotel',
        type: 'hotel',
        rating: 4.9,
        pricePerNight: 280,
        location: 'Lake Zurich',
        amenities: ['Lake Views', 'Luxury Spa', 'Michelin Restaurant']
      },
      transportation: {
        type: 'train',
        cost: 150,
        currency: 'CHF',
        details: 'Swiss Rail from Geneva'
      },
      recommendations: [
        'Try authentic Swiss fondue and chocolate',
        'Take a boat ride on Lake Zurich',
        'Visit luxury watch boutiques'
      ],
      confidence: 0.87
    },
    {
      id: 'brussels-beer-2024',
      title: 'Brussels Beer & Chocolate Festival',
      description: 'Indulge in Belgium\'s finest beers and world-renowned chocolates.',
      city: 'Brussels',
      country: 'Belgium',
      startDate: '2025-01-05',
      endDate: '2025-01-08',
      duration: 4,
      totalCost: 620,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      events: [
        {
          id: 'beer-festival',
          title: 'Brussels Beer Festival',
          description: 'Taste over 200 Belgian beer varieties',
          date: '2025-01-06',
          time: '15:00',
          venue: 'Brussels Expo',
          cost: 25,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'chocolate-workshop',
          title: 'Belgian Chocolate Making Workshop',
          description: 'Learn to make authentic Belgian chocolates',
          date: '2025-01-05',
          time: '10:00',
          venue: 'Chocolate Line Workshop',
          cost: 45,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel des Galeries',
        type: 'hotel',
        rating: 4.2,
        pricePerNight: 130,
        location: 'Royal Galleries',
        amenities: ['Historic Building', 'Central Location', 'Art Deco Style']
      },
      transportation: {
        type: 'train',
        cost: 75,
        currency: 'EUR',
        details: 'High-speed Thalys from Paris'
      },
      recommendations: [
        'Try authentic Belgian waffles',
        'Visit the Grand Place at night',
        'Take a day trip to Bruges'
      ],
      confidence: 0.89
    },
    {
      id: 'edinburgh-hogmanay-2024',
      title: 'Edinburgh Hogmanay New Year Celebration',
      description: 'Ring in the New Year with Scotland\'s legendary Hogmanay festivities.',
      city: 'Edinburgh',
      country: 'Scotland',
      startDate: '2024-12-30',
      endDate: '2025-01-02',
      duration: 4,
      totalCost: 750,
      currency: 'GBP',
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
      events: [
        {
          id: 'hogmanay-street-party',
          title: 'Hogmanay Street Party',
          description: 'Massive New Year\'s Eve celebration in the city center',
          date: '2024-12-31',
          time: '20:00',
          venue: 'Princes Street',
          cost: 35,
          currency: 'GBP'
        }
      ],
      subEvents: [
        {
          id: 'edinburgh-castle',
          title: 'Edinburgh Castle Tour',
          description: 'Explore Scotland\'s most famous castle',
          date: '2024-12-30',
          time: '11:00',
          venue: 'Edinburgh Castle',
          cost: 22,
          currency: 'GBP'
        }
      ],
      accommodation: {
        name: 'The Scotsman Hotel',
        type: 'hotel',
        rating: 4.4,
        pricePerNight: 165,
        location: 'Old Town',
        amenities: ['Historic Building', 'Spa', 'Royal Mile Location']
      },
      transportation: {
        type: 'train',
        cost: 140,
        currency: 'GBP',
        details: 'Train from London King\'s Cross'
      },
      recommendations: [
        'Try haggis and Scottish whisky',
        'Walk the Royal Mile',
        'Book Hogmanay tickets well in advance'
      ],
      confidence: 0.91
    },
    {
      id: 'florence-renaissance-2024',
      title: 'Florence Renaissance Art Immersion',
      description: 'Dive deep into Renaissance art and culture in the cradle of the Renaissance.',
      city: 'Florence',
      country: 'Italy',
      startDate: '2025-01-12',
      endDate: '2025-01-16',
      duration: 5,
      totalCost: 890,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1543832923-44667a62c71c?w=800&h=600&fit=crop',
      events: [
        {
          id: 'uffizi-private-tour',
          title: 'Private Uffizi Gallery Tour',
          description: 'Exclusive access to Renaissance masterpieces',
          date: '2025-01-13',
          time: '09:00',
          venue: 'Uffizi Gallery',
          cost: 85,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'cooking-class',
          title: 'Tuscan Cooking Class',
          description: 'Learn to cook authentic Tuscan cuisine',
          date: '2025-01-14',
          time: '16:00',
          venue: 'Cooking School Florence',
          cost: 75,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Davanzati',
        type: 'hotel',
        rating: 4.3,
        pricePerNight: 150,
        location: 'Historic Center',
        amenities: ['Renaissance Decor', 'City Views', 'Central Location']
      },
      transportation: {
        type: 'train',
        cost: 110,
        currency: 'EUR',
        details: 'High-speed train from Rome'
      },
      recommendations: [
        'Book museum tickets in advance',
        'Try authentic Florentine steak',
        'Climb the Duomo for city views'
      ],
      confidence: 0.93
    },
    {
      id: 'krakow-history-2024',
      title: 'Krakow Medieval History Tour',
      description: 'Explore Poland\'s ancient capital and its rich medieval heritage.',
      city: 'Krakow',
      country: 'Poland',
      startDate: '2025-01-19',
      endDate: '2025-01-22',
      duration: 4,
      totalCost: 420,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1544640332-4d5c5d5c8a93?w=800&h=600&fit=crop',
      events: [
        {
          id: 'wawel-castle-tour',
          title: 'Wawel Castle Royal Chambers Tour',
          description: 'Explore the former residence of Polish kings',
          date: '2025-01-20',
          time: '10:00',
          venue: 'Wawel Castle',
          cost: 18,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'salt-mine-tour',
          title: 'Wieliczka Salt Mine Tour',
          description: 'UNESCO World Heritage underground salt mine',
          date: '2025-01-21',
          time: '13:00',
          venue: 'Wieliczka Salt Mine',
          cost: 25,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Copernicus',
        type: 'hotel',
        rating: 4.5,
        pricePerNight: 90,
        location: 'Old Town',
        amenities: ['Historic Building', 'Spa', 'Castle Views']
      },
      transportation: {
        type: 'bus',
        cost: 55,
        currency: 'EUR',
        details: 'Comfortable bus from Prague'
      },
      recommendations: [
        'Try traditional pierogi and kielbasa',
        'Visit the Main Market Square',
        'Listen to the trumpet call from St. Mary\'s Tower'
      ],
      confidence: 0.86
    },
    {
      id: 'budapest-thermal-2024',
      title: 'Budapest Thermal Baths & Culture',
      description: 'Relax in historic thermal baths and explore Hungarian culture.',
      city: 'Budapest',
      country: 'Hungary',
      startDate: '2025-01-26',
      endDate: '2025-01-29',
      duration: 4,
      totalCost: 510,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&h=600&fit=crop',
      events: [
        {
          id: 'szechenyi-baths',
          title: 'Széchenyi Thermal Baths Experience',
          description: 'Relax in Europe\'s largest thermal bath complex',
          date: '2025-01-27',
          time: '15:00',
          venue: 'Széchenyi Thermal Baths',
          cost: 22,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'danube-cruise',
          title: 'Danube River Evening Cruise',
          description: 'Scenic cruise with views of illuminated parliament',
          date: '2025-01-26',
          time: '19:00',
          venue: 'Danube River',
          cost: 35,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Aria Hotel Budapest',
        type: 'hotel',
        rating: 4.6,
        pricePerNight: 110,
        location: 'Castle District',
        amenities: ['Music Theme', 'Rooftop Bar', 'Spa']
      },
      transportation: {
        type: 'train',
        cost: 85,
        currency: 'EUR',
        details: 'Train from Vienna'
      },
      recommendations: [
        'Try traditional goulash and lángos',
        'Visit both Buda and Pest sides',
        'Experience the nightlife in ruin pubs'
      ],
      confidence: 0.88
    },
    {
      id: 'milan-fashion-2024',
      title: 'Milan Fashion Week Experience',
      description: 'Immerse yourself in the world capital of fashion and design.',
      city: 'Milan',
      country: 'Italy',
      startDate: '2025-02-02',
      endDate: '2025-02-05',
      duration: 4,
      totalCost: 980,
      currency: 'EUR',
      imageUrl: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&h=600&fit=crop',
      events: [
        {
          id: 'fashion-week-show',
          title: 'Milan Fashion Week Show',
          description: 'Attend an exclusive fashion runway show',
          date: '2025-02-03',
          time: '18:00',
          venue: 'Milan Fashion District',
          cost: 150,
          currency: 'EUR'
        }
      ],
      subEvents: [
        {
          id: 'duomo-tour',
          title: 'Milan Cathedral & La Scala Tour',
          description: 'Gothic cathedral and world-famous opera house',
          date: '2025-02-02',
          time: '10:00',
          venue: 'Duomo di Milano',
          cost: 30,
          currency: 'EUR'
        }
      ],
      accommodation: {
        name: 'Hotel Principe di Savoia',
        type: 'hotel',
        rating: 4.7,
        pricePerNight: 200,
        location: 'Porta Garibaldi',
        amenities: ['Luxury Spa', 'Rooftop Restaurant', 'Fashion District']
      },
      transportation: {
        type: 'train',
        cost: 120,
        currency: 'EUR',
        details: 'High-speed train from Florence'
      },
      recommendations: [
        'Shop in the Quadrilatero della Moda',
        'Try authentic risotto alla milanese',
        'Visit the Navigli district for nightlife'
      ],
      confidence: 0.92
    }
  ];

  // Implement proper pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const bundles = mockBundles.slice(startIndex, endIndex);
  const hasMore = endIndex < mockBundles.length;
  
  console.log(`📄 Pagination: Page ${page}/${Math.ceil(mockBundles.length / limit)}, Items ${startIndex + 1}-${Math.min(endIndex, mockBundles.length)} of ${mockBundles.length}, Has more: ${hasMore}`);

  // Transform mock bundles to match TripBundle interface
  const transformedBundles = bundles.map(bundle => ({
    ...bundle,
    accommodation: {
      ...bundle.accommodation,
      type: bundle.accommodation.type as 'hotel' | 'hostel' | 'apartment' | 'resort'
    },
    transportation: {
      ...bundle.transportation,
      type: bundle.transportation.type as 'flight' | 'train' | 'bus' | 'car'
    },
    totalCost: {
      amount: bundle.totalCost as number,
      currency: bundle.currency as string,
      breakdown: {
        accommodation: Math.round((bundle.totalCost as number) * 0.4),
        entertainment: Math.round((bundle.totalCost as number) * 0.3),
        food: Math.round((bundle.totalCost as number) * 0.2),
        transport: Math.round((bundle.totalCost as number) * 0.1)
      }
    },
    events: bundle.events.map((event: any) => ({
      entertainment: {
        id: event.id,
        name: event.title,
        category: 'music' as const,
        subcategory: 'concert',
        description: event.description,
        averageDuration: 3,
        averageCost: { min: event.cost * 0.8, max: event.cost * 1.2, currency: event.currency },
        seasonality: 'year-round' as const,
        popularCountries: ['FR']
      },
      date: event.date,
      time: event.time,
      venue: event.venue,
      cost: event.cost,
      currency: event.currency
    })),
    subEvents: bundle.subEvents?.map((event: any) => ({
      entertainment: {
        id: event.id,
        name: event.title,
        category: 'culture' as const,
        subcategory: 'activity',
        description: event.description,
        averageDuration: 2,
        averageCost: { min: event.cost * 0.8, max: event.cost * 1.2, currency: event.currency },
        seasonality: 'year-round' as const,
        popularCountries: ['FR']
      },
      date: event.date,
      time: event.time,
      venue: event.venue,
      cost: event.cost,
      currency: event.currency
    })) || [],
    recommendations: {
      restaurants: ['Le Comptoir du Relais', 'L\'Ami Jean'],
      localTips: Array.isArray(bundle.recommendations) ? bundle.recommendations : ['Book in advance', 'Try local specialties'],
      weatherInfo: 'Mild autumn weather expected',
      packingList: ['Light jacket', 'Comfortable walking shoes', 'Camera']
    },
    confidence: Math.round((bundle.confidence as number) * 100), // Convert 0.9 to 90
    // Remove the old currency field
    currency: undefined
  }));

  return {
    bundles: transformedBundles,
    reasoning: `Based on your preferences, I found ${transformedBundles.length} amazing trip bundles tailored to your interests. Page ${page} of ${Math.ceil(mockBundles.length / limit)} (${mockBundles.length} total bundles).`,
    alternatives: ['Consider extending your stay', 'Look into similar destinations'],
    totalResults: mockBundles.length,
    pagination: {
      page,
      limit,
      total: mockBundles.length,
      hasMore
    }
  };
};

export default mockGenerateTripBundles;
