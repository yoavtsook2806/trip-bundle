// =============================================================================
// MOCK TRIP BUNDLE SERVICE - PWA Mock Data Provider
// =============================================================================

import { 
  type UserData,
  type GPTResponse,
  type EventsResponse,
  type GenerationOptions,
  type TripBundle,
  type Entertainment
} from 'trip-bundle-prompts-service';

/**
 * Mock service that provides sample data for development
 * Wraps TripBundlePromptService but returns mock data instead of calling API
 */
export class MockTripBundleService {
  private userData: UserData;

  constructor(userData: UserData) {
    this.userData = userData;
  }

  /**
   * Update user data
   */
  updateUserData(userData: UserData): void {
    this.userData = userData;
  }

  /**
   * Generate trip bundles using mock data
   */
  async generateTripBundles(options: GenerationOptions = {}): Promise<GPTResponse> {
    const { page = 1, limit = 5 } = options;
    const startTime = Date.now();

    console.log(`🎭 Using mock data (VITE_MOCK=true) - Page ${page}, Limit ${limit}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.getMockResponse(Date.now() - startTime, page, limit);
  }

  /**
   * Get events for a specific city and date range using mock data
   */
  async getEvents(city: string, startDate: string, endDate: string, options: { page?: number; limit?: number } = {}): Promise<EventsResponse> {
    const processingTime = Math.random() * 1000 + 500; // Simulate processing time

    // Create more mock events based on the city for better pagination testing
    const mockEvents = [
      {
        entertainment: this.createMockEntertainment('concert-hall-event', `${city} Symphony Orchestra`, 'music', 'Classical music performance by local orchestra'),
        date: startDate,
        time: '19:30',
        venue: `${city} Concert Hall`,
        cost: 45,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-symphony'
      },
      {
        entertainment: this.createMockEntertainment('art-gallery-opening', `Modern Art Exhibition`, 'culture', 'Contemporary art exhibition featuring local and international artists'),
        date: this.addDays(startDate, 1),
        time: '18:00',
        venue: `${city} Modern Art Gallery`,
        cost: 15,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-art'
      },
      {
        entertainment: this.createMockEntertainment('food-festival', `${city} Food Festival`, 'food', 'Local cuisine festival with traditional and modern dishes'),
        date: this.addDays(startDate, 2),
        time: '12:00',
        venue: `${city} Central Square`,
        cost: 25,
        currency: 'EUR'
      },
      {
        entertainment: this.createMockEntertainment('jazz-club', `Jazz Night`, 'music', 'Live jazz performance by local musicians'),
        date: this.addDays(startDate, 2),
        time: '21:00',
        venue: `Blue Note ${city}`,
        cost: 30,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-jazz'
      },
      {
        entertainment: this.createMockEntertainment('walking-tour', `Historical Walking Tour`, 'culture', 'Guided tour through the historic districts'),
        date: this.addDays(startDate, 3),
        time: '10:00',
        venue: `${city} Old Town`,
        cost: 20,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-tour'
      },
      // Add more events for pagination testing
      {
        entertainment: this.createMockEntertainment('rock-concert', `${city} Rock Festival`, 'music', 'Multi-day rock festival featuring international bands'),
        date: this.addDays(startDate, 4),
        time: '20:00',
        venue: `${city} Stadium`,
        cost: 85,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-rock'
      },
      {
        entertainment: this.createMockEntertainment('theater-show', `Shakespeare in the Park`, 'culture', 'Outdoor theater performance of classic Shakespeare'),
        date: this.addDays(startDate, 5),
        time: '19:00',
        venue: `${city} Central Park`,
        cost: 35,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-theater'
      },
      {
        entertainment: this.createMockEntertainment('wine-tasting', `${city} Wine Experience`, 'food', 'Wine tasting with local vintners and cheese pairings'),
        date: this.addDays(startDate, 6),
        time: '17:00',
        venue: `${city} Wine Bar`,
        cost: 55,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-wine'
      },
      {
        entertainment: this.createMockEntertainment('night-market', `${city} Night Market`, 'nightlife', 'Bustling night market with street food and crafts'),
        date: this.addDays(startDate, 7),
        time: '18:00',
        venue: `${city} Market Square`,
        cost: 10,
        currency: 'EUR'
      },
      {
        entertainment: this.createMockEntertainment('hiking-tour', `${city} Nature Hike`, 'nature', 'Guided hiking tour through scenic natural areas'),
        date: this.addDays(startDate, 8),
        time: '08:00',
        venue: `${city} Nature Reserve`,
        cost: 40,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-hike'
      },
      {
        entertainment: this.createMockEntertainment('cooking-class', `Traditional ${city} Cooking`, 'food', 'Learn to cook traditional local dishes with expert chefs'),
        date: this.addDays(startDate, 9),
        time: '14:00',
        venue: `${city} Culinary School`,
        cost: 75,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-cooking'
      },
      {
        entertainment: this.createMockEntertainment('sports-match', `${city} Football Match`, 'sports', 'Local football team championship match'),
        date: this.addDays(startDate, 10),
        time: '15:00',
        venue: `${city} Sports Stadium`,
        cost: 50,
        currency: 'EUR',
        bookingUrl: 'https://example.com/book-football'
      }
    ].filter(event => event.date <= endDate); // Only include events within date range

    // Add pagination logic
    const { page = 1, limit = 10 } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEvents = mockEvents.slice(startIndex, endIndex);
    const totalEvents = mockEvents.length;
    const hasMore = endIndex < totalEvents;



    return {
      events: paginatedEvents,
      reasoning: `Found ${paginatedEvents.length} diverse entertainment events in ${city} between ${startDate} and ${endDate} (page ${page} of ${Math.ceil(totalEvents / limit)}), including music, culture, and food experiences.`,
      processingTime,
      pagination: {
        page,
        limit,
        total: totalEvents,
        hasMore
      }
    };
  }

  /**
   * Check if the service is configured (always true for mock)
   */
  isConfigured(): boolean {
    return true;
  }

  // =============================================================================
  // PRIVATE METHODS - Mock Data Generation
  // =============================================================================

  /**
   * Helper function to create complete entertainment objects for mock data
   */
  private createMockEntertainment(id: string, name: string, category: Entertainment['category'], description: string): Entertainment {
    return {
      id,
      name,
      category,
      subcategory: 'general',
      description,
      averageDuration: 2,
      averageCost: { min: 20, max: 100, currency: 'EUR' },
      seasonality: 'year-round',
      popularCountries: ['GB', 'FR', 'DE', 'IT', 'ES']
    };
  }

  /**
   * Generate mock response for testing
   */
  private getMockResponse(processingTime: number, page: number = 1, limit: number = 5): GPTResponse {
    const mockBundles: TripBundle[] = [
      {
        id: 'london-arsenal-coldplay',
        title: 'London: Arsenal vs Chelsea Derby & Coldplay Final Show',
        description: 'Witness the North London Derby and Coldplay\'s farewell concert - once-in-a-lifetime events',
        country: 'United Kingdom',
        city: 'London',
        duration: 4,
        startDate: '2024-09-15',
        endDate: '2024-09-18',
        totalCost: {
          amount: 1800,
          currency: 'EUR',
          breakdown: {
            accommodation: 480,
            entertainment: 800,
            food: 200,
            transport: 320
          }
        },
        events: [
          {
            entertainment: {
              id: 'arsenal-chelsea-derby',
              name: 'Arsenal vs Chelsea - North London Derby',
              category: 'sports',
              subcategory: 'football',
              description: 'Historic rivalry match - Premier League title decider',
              averageDuration: 2,
              averageCost: { min: 150, max: 500, currency: 'EUR' },
              seasonality: 'seasonal',
              popularCountries: ['GB']
            },
            date: '2024-09-16',
            time: '16:30',
            venue: 'Emirates Stadium',
            cost: 280,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'coldplay-farewell-tour',
              name: 'Coldplay - Music of the Spheres Farewell Tour',
              category: 'music',
              subcategory: 'concert',
              description: 'Final UK show of their farewell tour - last chance to see them',
              averageDuration: 3,
              averageCost: { min: 200, max: 600, currency: 'EUR' },
              seasonality: 'limited',
              popularCountries: ['GB']
            },
            date: '2024-09-17',
            time: '20:00',
            venue: 'Wembley Stadium',
            cost: 450,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'The Z Hotel Piccadilly',
          type: 'hotel',
          rating: 4.2,
          pricePerNight: 120,
          location: 'Central London',
          amenities: ['WiFi', 'Air Conditioning']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip economy flight',
          cost: 220,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Dishoom', 'Borough Market'],
          localTips: ['Book tube tickets in advance'],
          weatherInfo: 'Mild autumn weather',
          packingList: ['Light jacket', 'Comfortable shoes']
        },
        confidence: 92
      },
      {
        id: 'paris-fashion-daft-punk',
        title: 'Paris Fashion Week & Daft Punk Reunion Concert',
        description: 'Exclusive Paris Fashion Week shows and the legendary Daft Punk comeback concert',
        country: 'France',
        city: 'Paris',
        duration: 5,
        startDate: '2024-09-20',
        endDate: '2024-09-24',
        totalCost: {
          amount: 2400,
          currency: 'EUR',
          breakdown: {
            accommodation: 750,
            entertainment: 1000,
            food: 450,
            transport: 200
          }
        },
        events: [
          {
            entertainment: {
              id: 'paris-fashion-week-2024',
              name: 'Paris Fashion Week - Chanel & Dior Shows',
              category: 'culture',
              subcategory: 'fashion',
              description: 'Exclusive access to Chanel and Dior runway shows',
              averageDuration: 6,
              averageCost: { min: 300, max: 800, currency: 'EUR' },
              seasonality: 'limited',
              popularCountries: ['FR']
            },
            date: '2024-09-21',
            time: '15:00',
            venue: 'Grand Palais',
            cost: 600,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'daft-punk-reunion-2024',
              name: 'Daft Punk - One More Time Reunion Concert',
              category: 'music',
              subcategory: 'electronic',
              description: 'First concert in 10 years - limited one-night only performance',
              averageDuration: 3,
              averageCost: { min: 200, max: 600, currency: 'EUR' },
              seasonality: 'exclusive',
              popularCountries: ['FR']
            },
            date: '2024-09-22',
            time: '21:00',
            venue: 'AccorHotels Arena',
            cost: 380,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Hotel des Grands Boulevards',
          type: 'hotel',
          rating: 4.5,
          pricePerNight: 150,
          location: 'Marais District',
          amenities: ['WiFi', 'Restaurant', 'Concierge']
        },
        transportation: {
          type: 'train',
          details: 'Eurostar from London',
          cost: 200,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['L\'Ami Jean', 'Du Pain et des Idées'],
          localTips: ['Book museum tickets online', 'Try local bakeries'],
          weatherInfo: 'Pleasant autumn weather',
          packingList: ['Smart casual attire', 'Walking shoes']
        },
        confidence: 88
      },
      {
        id: 'rome-gladiator-pavarotti',
        title: 'Rome: Gladiator Movie Premiere & Pavarotti Tribute Concert',
        description: 'World premiere of Gladiator III at the Colosseum and exclusive Pavarotti tribute',
        country: 'Italy',
        city: 'Rome',
        duration: 4,
        startDate: '2024-09-25',
        endDate: '2024-09-28',
        totalCost: {
          amount: 2100,
          currency: 'EUR',
          breakdown: {
            accommodation: 520,
            entertainment: 900,
            food: 320,
            transport: 360
          }
        },
        events: [
          {
            entertainment: {
              id: 'gladiator-3-premiere',
              name: 'Gladiator III - World Premiere at Colosseum',
              category: 'culture',
              subcategory: 'cinema',
              description: 'Exclusive world premiere screening inside the ancient Colosseum',
              averageDuration: 4,
              averageCost: { min: 300, max: 800, currency: 'EUR' },
              seasonality: 'exclusive',
              popularCountries: ['IT']
            },
            date: '2024-09-26',
            time: '20:00',
            venue: 'Colosseum Arena Floor',
            cost: 650,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'pavarotti-tribute-2024',
              name: 'Andrea Bocelli - Pavarotti 30th Anniversary Tribute',
              category: 'music',
              subcategory: 'opera',
              description: 'Once-in-a-lifetime tribute concert featuring world-class tenors',
              averageDuration: 3,
              averageCost: { min: 150, max: 400, currency: 'EUR' },
              seasonality: 'anniversary',
              popularCountries: ['IT']
            },
            date: '2024-09-27',
            time: '20:30',
            venue: 'Baths of Caracalla',
            cost: 280,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Hotel Artemide',
          type: 'hotel',
          rating: 4.4,
          pricePerNight: 130,
          location: 'Near Termini Station',
          amenities: ['WiFi', 'Rooftop Terrace', 'Spa']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip economy flight',
          cost: 280,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Da Enzo', 'Trattoria Monti'],
          localTips: ['Book Vatican tickets in advance', 'Try gelato daily'],
          weatherInfo: 'Warm Mediterranean weather',
          packingList: ['Comfortable walking shoes', 'Sun hat']
        },
        confidence: 90
      },
      {
        id: 'barcelona-clasico-primavera',
        title: 'Barcelona: El Clasico & Primavera Sound Final Day',
        description: 'Real Madrid vs Barcelona El Clasico and the legendary Primavera Sound closing concert',
        country: 'Spain',
        city: 'Barcelona',
        duration: 3,
        startDate: '2024-10-01',
        endDate: '2024-10-03',
        totalCost: {
          amount: 1650,
          currency: 'EUR',
          breakdown: {
            accommodation: 300,
            entertainment: 950,
            food: 200,
            transport: 200
          }
        },
        events: [
          {
            entertainment: {
              id: 'el-clasico-2024',
              name: 'Real Madrid vs FC Barcelona - El Clasico',
              category: 'sports',
              subcategory: 'football',
              description: 'The biggest rivalry in football - La Liga title decider match',
              averageDuration: 2,
              averageCost: { min: 200, max: 800, currency: 'EUR' },
              seasonality: 'seasonal',
              popularCountries: ['ES']
            },
            date: '2024-10-01',
            time: '21:00',
            venue: 'Camp Nou',
            cost: 520,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'primavera-sound-finale',
              name: 'Primavera Sound 2024 - Arctic Monkeys Closing Concert',
              category: 'music',
              subcategory: 'rock',
              description: 'Final night of Europe\'s biggest indie music festival',
              averageDuration: 8,
              averageCost: { min: 150, max: 400, currency: 'EUR' },
              seasonality: 'annual',
              popularCountries: ['ES']
            },
            date: '2024-10-02',
            time: '18:00',
            venue: 'Parc del Fòrum',
            cost: 320,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Hotel Barcelona Center',
          type: 'hotel',
          rating: 4.0,
          pricePerNight: 100,
          location: 'Gothic Quarter',
          amenities: ['WiFi', 'Rooftop Pool', 'Bar']
        },
        transportation: {
          type: 'train',
          details: 'High-speed train from Madrid',
          cost: 200,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Cal Pep', 'Disfrutar'],
          localTips: ['Dinner starts late (9-10pm)', 'Learn basic Catalan phrases'],
          weatherInfo: 'Perfect Mediterranean weather',
          packingList: ['Dancing shoes', 'Light evening wear']
        },
        confidence: 87
      },
      {
        id: 'amsterdam-culture-nature',
        title: 'Amsterdam Culture & Canal Experience',
        description: 'Discover Amsterdam\'s rich culture, museums, and beautiful canals',
        country: 'Netherlands',
        city: 'Amsterdam',
        duration: 3,
        startDate: '2024-10-05',
        endDate: '2024-10-07',
        totalCost: {
          amount: 1100,
          currency: 'EUR',
          breakdown: {
            accommodation: 450,
            entertainment: 200,
            food: 250,
            transport: 200
          }
        },
        events: [
          {
            entertainment: {
              id: 'van-gogh-final-exhibition',
              name: 'Van Gogh - The Final Letters Exhibition (Last Week)',
              category: 'culture',
              subcategory: 'exhibition',
              description: 'Never-before-seen Van Gogh letters - final week before closing forever',
              averageDuration: 3,
              averageCost: { min: 50, max: 80, currency: 'EUR' },
              seasonality: 'limited',
              popularCountries: ['NL']
            },
            date: '2024-10-05',
            time: '10:00',
            venue: 'Van Gogh Museum',
            cost: 65,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'tiesto-farewell-amsterdam',
              name: 'Tiësto - Amsterdam Farewell Concert',
              category: 'music',
              subcategory: 'electronic',
              description: 'DJ Tiësto\'s final Amsterdam performance before retirement',
              averageDuration: 4,
              averageCost: { min: 80, max: 200, currency: 'EUR' },
              seasonality: 'exclusive',
              popularCountries: ['NL']
            },
            date: '2024-10-06',
            time: '21:00',
            venue: 'Ziggo Dome',
            cost: 140,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Lloyd Hotel',
          type: 'hotel',
          rating: 4.3,
          pricePerNight: 150,
          location: 'Eastern Docklands',
          amenities: ['WiFi', 'Design Hotel', 'Restaurant']
        },
        transportation: {
          type: 'train',
          details: 'Direct train from Brussels',
          cost: 200,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Café de Reiger', 'Restaurant Greetje'],
          localTips: ['Rent a bike to explore', 'Book museum tickets online'],
          weatherInfo: 'Cool autumn weather',
          packingList: ['Rain jacket', 'Comfortable walking shoes']
        },
        confidence: 85
      },
      {
        id: 'vienna-mozart-gala',
        title: 'Vienna: Mozart 300th Anniversary Gala & Schönbrunn Night Concert',
        description: 'Once-in-a-lifetime Mozart anniversary gala and exclusive palace concert',
        country: 'Austria',
        city: 'Vienna',
        duration: 4,
        startDate: '2024-10-10',
        endDate: '2024-10-13',
        totalCost: {
          amount: 1300,
          currency: 'EUR',
          breakdown: {
            accommodation: 520,
            entertainment: 320,
            food: 280,
            transport: 180
          }
        },
        events: [
          {
            entertainment: {
              id: 'vienna-opera',
              name: 'Vienna State Opera',
              category: 'music',
              subcategory: 'opera',
              description: 'World-famous opera performance',
              averageDuration: 3,
              averageCost: { min: 100, max: 300, currency: 'EUR' },
              seasonality: 'seasonal',
              popularCountries: ['AT']
            },
            date: '2024-10-11',
            time: '19:00',
            venue: 'Vienna State Opera',
            cost: 180,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'schonbrunn-palace',
              name: 'Schönbrunn Palace Tour',
              category: 'culture',
              subcategory: 'historical',
              description: 'Imperial palace and gardens tour',
              averageDuration: 3,
              averageCost: { min: 20, max: 40, currency: 'EUR' },
              seasonality: 'year-round',
              popularCountries: ['AT']
            },
            date: '2024-10-12',
            time: '10:00',
            venue: 'Schönbrunn Palace',
            cost: 35,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Hotel Sacher',
          type: 'hotel',
          rating: 4.8,
          pricePerNight: 130,
          location: 'Historic Center',
          amenities: ['WiFi', 'Spa', 'Famous Café']
        },
        transportation: {
          type: 'train',
          details: 'Direct train from Munich',
          cost: 180,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Figlmüller', 'Steirereck'],
          localTips: ['Try Sachertorte', 'Dress formally for opera'],
          weatherInfo: 'Cool autumn weather',
          packingList: ['Formal attire', 'Comfortable walking shoes']
        },
        confidence: 93
      },
      {
        id: 'prague-oktoberfest-metallica',
        title: 'Prague: Czech Oktoberfest & Metallica Exclusive Concert',
        description: 'Traditional Czech Oktoberfest and Metallica\'s only Eastern European show',
        country: 'Czech Republic',
        city: 'Prague',
        duration: 3,
        startDate: '2024-10-15',
        endDate: '2024-10-17',
        totalCost: {
          amount: 800,
          currency: 'EUR',
          breakdown: {
            accommodation: 300,
            entertainment: 150,
            food: 200,
            transport: 150
          }
        },
        events: [
          {
            entertainment: {
              id: 'prague-castle',
              name: 'Prague Castle Tour',
              category: 'culture',
              subcategory: 'historical',
              description: 'Medieval castle complex tour',
              averageDuration: 3,
              averageCost: { min: 15, max: 30, currency: 'EUR' },
              seasonality: 'year-round',
              popularCountries: ['CZ']
            },
            date: '2024-10-15',
            time: '10:00',
            venue: 'Prague Castle',
            cost: 25,
            currency: 'EUR'
          },
          {
            entertainment: {
              id: 'beer-tasting',
              name: 'Traditional Beer Hall Experience',
              category: 'food',
              subcategory: 'tasting',
              description: 'Authentic Czech beer tasting experience',
              averageDuration: 3,
              averageCost: { min: 20, max: 50, currency: 'EUR' },
              seasonality: 'year-round',
              popularCountries: ['CZ']
            },
            date: '2024-10-16',
            time: '18:00',
            venue: 'U Fleků Brewery',
            cost: 35,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Golden Well Hotel',
          type: 'hotel',
          rating: 4.6,
          pricePerNight: 100,
          location: 'Lesser Town',
          amenities: ['WiFi', 'Castle Views', 'Spa']
        },
        transportation: {
          type: 'train',
          details: 'Direct train from Vienna',
          cost: 150,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Lokál', 'Café Savoy'],
          localTips: ['Learn to say "Na zdraví" (Cheers)', 'Walk across Charles Bridge at sunrise'],
          weatherInfo: 'Cool autumn weather',
          packingList: ['Warm jacket', 'Camera for architecture']
        },
        confidence: 89
      },
      {
        id: 'tokyo-anime-sumo',
        title: 'Tokyo: Anime Convention & Sumo Tournament',
        description: 'Immerse in Japanese culture with anime events and traditional sumo wrestling',
        country: 'Japan',
        city: 'Tokyo',
        duration: 6,
        startDate: '2024-10-10',
        endDate: '2024-10-15',
        totalCost: {
          amount: 2200,
          currency: 'EUR',
          breakdown: {
            accommodation: 720,
            entertainment: 600,
            food: 480,
            transport: 400
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('anime-expo-tokyo', 'Tokyo Anime Expo 2024', 'culture', 'Largest anime convention in Asia'),
            date: '2024-10-12',
            time: '10:00',
            venue: 'Tokyo Big Sight',
            cost: 80,
            currency: 'EUR'
          },
          {
            entertainment: this.createMockEntertainment('sumo-tournament', 'Grand Sumo Tournament', 'sports', 'Traditional Japanese sumo wrestling'),
            date: '2024-10-14',
            time: '16:00',
            venue: 'Ryogoku Kokugikan',
            cost: 120,
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
          details: 'Round-trip flight to Tokyo Narita',
          cost: 400,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Sushi Jiro', 'Ramen Yokocho', 'Tempura Kondo'],
          localTips: ['Learn basic Japanese phrases', 'Bow when greeting', 'Remove shoes indoors'],
          weatherInfo: 'Pleasant autumn weather, mild temperatures',
          packingList: ['Comfortable walking shoes', 'Light jacket', 'Portable WiFi device']
        },
        confidence: 92
      },
      {
        id: 'new-york-broadway-knicks',
        title: 'New York: Broadway Shows & Knicks Game',
        description: 'Experience the best of NYC entertainment with Broadway and NBA basketball',
        country: 'United States',
        city: 'New York',
        duration: 5,
        startDate: '2024-11-20',
        endDate: '2024-11-24',
        totalCost: {
          amount: 1900,
          currency: 'EUR',
          breakdown: {
            accommodation: 600,
            entertainment: 700,
            food: 300,
            transport: 300
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('hamilton-broadway', 'Hamilton', 'culture', 'Award-winning Broadway musical'),
            date: '2024-11-21',
            time: '20:00',
            venue: 'Richard Rodgers Theatre',
            cost: 200,
            currency: 'EUR'
          },
          {
            entertainment: this.createMockEntertainment('knicks-vs-lakers', 'Knicks vs Lakers', 'sports', 'NBA basketball game'),
            date: '2024-11-23',
            time: '19:30',
            venue: 'Madison Square Garden',
            cost: 150,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Times Square Hotel',
          type: 'hotel',
          rating: 4.1,
          pricePerNight: 120,
          location: 'Midtown Manhattan',
          amenities: ['24/7 Concierge', 'Fitness Center', 'Restaurant']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip flight to JFK',
          cost: 300,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Katz\'s Delicatessen', 'Joe\'s Pizza', 'The Halal Guys'],
          localTips: ['Use MetroCard for subway', 'Tip 18-20%', 'Walk fast on sidewalks'],
          weatherInfo: 'Cool November weather, dress warmly',
          packingList: ['Warm coat', 'Comfortable walking shoes', 'Umbrella']
        },
        confidence: 88
      },
      {
        id: 'sydney-opera-surfing',
        title: 'Sydney: Opera House Gala & Surfing Lessons',
        description: 'Combine high culture with beach lifestyle in beautiful Sydney',
        country: 'Australia',
        city: 'Sydney',
        duration: 7,
        startDate: '2024-12-01',
        endDate: '2024-12-07',
        totalCost: {
          amount: 2400,
          currency: 'EUR',
          breakdown: {
            accommodation: 840,
            entertainment: 500,
            food: 560,
            transport: 500
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('opera-house-gala', 'Sydney Opera House Gala', 'culture', 'Prestigious opera performance'),
            date: '2024-12-03',
            time: '19:30',
            venue: 'Sydney Opera House',
            cost: 180,
            currency: 'EUR'
          },
          {
            entertainment: this.createMockEntertainment('bondi-surfing', 'Bondi Beach Surfing Lessons', 'adventure', 'Learn to surf at famous Bondi Beach'),
            date: '2024-12-05',
            time: '09:00',
            venue: 'Bondi Beach',
            cost: 80,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Sydney Harbour Hotel',
          type: 'hotel',
          rating: 4.6,
          pricePerNight: 120,
          location: 'Circular Quay',
          amenities: ['Harbour View', 'Pool', 'Spa', 'Fine Dining']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip flight to Sydney Kingsford Smith',
          cost: 500,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Quay Restaurant', 'Bennelong', 'Fish Market'],
          localTips: ['Sun protection essential', 'Tipping not required', 'Watch for wildlife'],
          weatherInfo: 'Summer season, warm and sunny',
          packingList: ['Sunscreen', 'Swimwear', 'Light summer clothes', 'Hat']
        },
        confidence: 91
      },
      {
        id: 'berlin-techno-history',
        title: 'Berlin: Techno Clubs & Historical Tours',
        description: 'Experience Berlin\'s legendary nightlife and rich history',
        country: 'Germany',
        city: 'Berlin',
        duration: 4,
        startDate: '2024-09-25',
        endDate: '2024-09-28',
        totalCost: {
          amount: 1400,
          currency: 'EUR',
          breakdown: {
            accommodation: 320,
            entertainment: 400,
            food: 280,
            transport: 400
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('berghain-techno', 'Berghain Techno Night', 'nightlife', 'World famous techno club'),
            date: '2024-09-26',
            time: '23:00',
            venue: 'Berghain',
            cost: 25,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Berlin Central Hostel',
          type: 'hostel',
          rating: 4.2,
          pricePerNight: 80,
          location: 'Mitte',
          amenities: ['Free WiFi', 'Bar', 'Kitchen']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip to Berlin Brandenburg',
          cost: 400,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Curry 36', 'Döner Kebab', 'Prater Garten'],
          localTips: ['Bring cash', 'Learn basic German', 'Respect club dress codes'],
          weatherInfo: 'Cool autumn weather',
          packingList: ['Dark clothes for clubs', 'Comfortable shoes']
        },
        confidence: 87
      },
      {
        id: 'istanbul-culture-food',
        title: 'Istanbul: Cultural Sites & Food Tour',
        description: 'Explore the crossroads of Europe and Asia with amazing cuisine',
        country: 'Turkey',
        city: 'Istanbul',
        duration: 5,
        startDate: '2024-10-05',
        endDate: '2024-10-09',
        totalCost: {
          amount: 1200,
          currency: 'EUR',
          breakdown: {
            accommodation: 300,
            entertainment: 300,
            food: 400,
            transport: 200
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('hagia-sophia', 'Hagia Sophia Tour', 'culture', 'Historic Byzantine cathedral'),
            date: '2024-10-06',
            time: '10:00',
            venue: 'Hagia Sophia',
            cost: 50,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Sultanahmet Hotel',
          type: 'hotel',
          rating: 4.0,
          pricePerNight: 60,
          location: 'Old City',
          amenities: ['Rooftop View', 'Turkish Bath', 'Restaurant']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip to Istanbul Airport',
          cost: 200,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Pandeli', 'Hamdi Restaurant', 'Balik Ekmek'],
          localTips: ['Haggle in Grand Bazaar', 'Remove shoes in mosques', 'Try Turkish tea'],
          weatherInfo: 'Pleasant autumn weather',
          packingList: ['Modest clothing', 'Comfortable walking shoes']
        },
        confidence: 90
      },
      {
        id: 'reykjavik-northern-lights',
        title: 'Reykjavik: Northern Lights & Blue Lagoon',
        description: 'Witness Aurora Borealis and relax in geothermal spas',
        country: 'Iceland',
        city: 'Reykjavik',
        duration: 4,
        startDate: '2024-11-15',
        endDate: '2024-11-18',
        totalCost: {
          amount: 1800,
          currency: 'EUR',
          breakdown: {
            accommodation: 480,
            entertainment: 600,
            food: 320,
            transport: 400
          }
        },
        events: [
          {
            entertainment: this.createMockEntertainment('northern-lights-tour', 'Northern Lights Tour', 'nature', 'Aurora Borealis viewing experience'),
            date: '2024-11-16',
            time: '20:00',
            venue: 'Outside Reykjavik',
            cost: 120,
            currency: 'EUR'
          }
        ],
        accommodation: {
          name: 'Reykjavik Marina Hotel',
          type: 'hotel',
          rating: 4.4,
          pricePerNight: 120,
          location: 'City Center',
          amenities: ['Spa', 'Restaurant', 'Harbor View']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip to Keflavik Airport',
          cost: 400,
          currency: 'EUR'
        },
        recommendations: {
          restaurants: ['Dill Restaurant', 'Bæjarins Beztu Pylsur', 'Café Loki'],
          localTips: ['Dress very warmly', 'Book tours early', 'Try local fish'],
          weatherInfo: 'Cold November weather, possible snow',
          packingList: ['Warm winter clothes', 'Waterproof jacket', 'Thermal underwear']
        },
        confidence: 94
      },
      {
        id: 'dublin-music-pubs',
        title: 'Dublin: Traditional Music & Pub Crawl',
        description: 'Experience authentic Irish culture with music and hospitality',
        country: 'Ireland',
        city: 'Dublin',
        duration: 3,
        startDate: '2024-10-20',
        endDate: '2024-10-22',
        totalCost: { amount: 900, currency: 'EUR', breakdown: { accommodation: 240, entertainment: 200, food: 180, transport: 280 } },
        events: [{ entertainment: this.createMockEntertainment('irish-music', 'Traditional Irish Music Night', 'music', 'Authentic Irish folk music'), date: '2024-10-21', time: '20:00', venue: 'Temple Bar', cost: 30, currency: 'EUR' }],
        accommodation: { name: 'Dublin City Hotel', type: 'hotel', rating: 4.1, pricePerNight: 80, location: 'Temple Bar', amenities: ['Free WiFi', 'Pub', 'Breakfast'] },
        transportation: { type: 'flight', details: 'Round-trip to Dublin Airport', cost: 280, currency: 'EUR' },
        recommendations: { restaurants: ['The Brazen Head', 'Guinness Storehouse'], localTips: ['Say Sláinte when toasting', 'Tip in pubs'], weatherInfo: 'Rainy autumn weather', packingList: ['Raincoat', 'Umbrella'] },
        confidence: 86
      },
      {
        id: 'lisbon-fado-beaches',
        title: 'Lisbon: Fado Music & Coastal Beaches',
        description: 'Soulful Portuguese music and beautiful Atlantic coastline',
        country: 'Portugal',
        city: 'Lisbon',
        duration: 5,
        startDate: '2024-11-01',
        endDate: '2024-11-05',
        totalCost: { amount: 1100, currency: 'EUR', breakdown: { accommodation: 350, entertainment: 250, food: 300, transport: 200 } },
        events: [{ entertainment: this.createMockEntertainment('fado-night', 'Fado Performance', 'music', 'Traditional Portuguese music'), date: '2024-11-02', time: '21:00', venue: 'Alfama District', cost: 40, currency: 'EUR' }],
        accommodation: { name: 'Lisbon Heritage Hotel', type: 'hotel', rating: 4.3, pricePerNight: 70, location: 'Alfama', amenities: ['Rooftop Terrace', 'Traditional Decor'] },
        transportation: { type: 'flight', details: 'Round-trip to Lisbon Airport', cost: 200, currency: 'EUR' },
        recommendations: { restaurants: ['Pastéis de Belém', 'Time Out Market'], localTips: ['Try pastéis de nata', 'Take Tram 28'], weatherInfo: 'Mild autumn weather', packingList: ['Light jacket', 'Sunglasses'] },
        confidence: 89
      },
      {
        id: 'copenhagen-design-cycling',
        title: 'Copenhagen: Design Museums & Cycling Tours',
        description: 'Scandinavian design culture and eco-friendly city exploration',
        country: 'Denmark',
        city: 'Copenhagen',
        duration: 4,
        startDate: '2024-09-30',
        endDate: '2024-10-03',
        totalCost: { amount: 1500, currency: 'EUR', breakdown: { accommodation: 480, entertainment: 300, food: 320, transport: 400 } },
        events: [{ entertainment: this.createMockEntertainment('design-museum', 'Design Museum Denmark', 'culture', 'Danish design exhibition'), date: '2024-10-01', time: '10:00', venue: 'Bredgade', cost: 25, currency: 'EUR' }],
        accommodation: { name: 'Copenhagen Design Hotel', type: 'hotel', rating: 4.5, pricePerNight: 120, location: 'Vesterbro', amenities: ['Modern Design', 'Bike Rental', 'Eco-Friendly'] },
        transportation: { type: 'flight', details: 'Round-trip to Copenhagen Airport', cost: 400, currency: 'EUR' },
        recommendations: { restaurants: ['Noma', 'Torvehallerne Market'], localTips: ['Rent a bike', 'Visit Tivoli Gardens'], weatherInfo: 'Cool autumn weather', packingList: ['Layers', 'Rain jacket'] },
        confidence: 91
      },
      {
        id: 'krakow-history-pierogi',
        title: 'Krakow: Medieval History & Polish Cuisine',
        description: 'Explore medieval architecture and taste traditional Polish food',
        country: 'Poland',
        city: 'Krakow',
        duration: 4,
        startDate: '2024-10-15',
        endDate: '2024-10-18',
        totalCost: { amount: 800, currency: 'EUR', breakdown: { accommodation: 240, entertainment: 180, food: 200, transport: 180 } },
        events: [{ entertainment: this.createMockEntertainment('wawel-castle', 'Wawel Castle Tour', 'culture', 'Medieval royal castle'), date: '2024-10-16', time: '11:00', venue: 'Wawel Hill', cost: 20, currency: 'EUR' }],
        accommodation: { name: 'Krakow Old Town Hotel', type: 'hotel', rating: 4.2, pricePerNight: 60, location: 'Old Town', amenities: ['Historic Building', 'Central Location'] },
        transportation: { type: 'flight', details: 'Round-trip to Krakow Airport', cost: 180, currency: 'EUR' },
        recommendations: { restaurants: ['Pierogi Heaven', 'Pod Aniołami'], localTips: ['Try different pierogi types', 'Visit Main Market Square'], weatherInfo: 'Cool autumn weather', packingList: ['Comfortable walking shoes', 'Warm jacket'] },
        confidence: 88
      },
      {
        id: 'budapest-thermal-ruin-bars',
        title: 'Budapest: Thermal Baths & Ruin Bar Scene',
        description: 'Relax in historic thermal baths and experience unique nightlife',
        country: 'Hungary',
        city: 'Budapest',
        duration: 4,
        startDate: '2024-11-10',
        endDate: '2024-11-13',
        totalCost: { amount: 1000, currency: 'EUR', breakdown: { accommodation: 280, entertainment: 220, food: 200, transport: 300 } },
        events: [{ entertainment: this.createMockEntertainment('szechenyi-baths', 'Széchenyi Thermal Baths', 'nature', 'Historic thermal spa complex'), date: '2024-11-11', time: '14:00', venue: 'City Park', cost: 25, currency: 'EUR' }],
        accommodation: { name: 'Budapest River Hotel', type: 'hotel', rating: 4.4, pricePerNight: 70, location: 'Pest Side', amenities: ['River View', 'Spa Access'] },
        transportation: { type: 'flight', details: 'Round-trip to Budapest Airport', cost: 300, currency: 'EUR' },
        recommendations: { restaurants: ['Central Market Hall', 'Frici Papa'], localTips: ['Bring swimwear to baths', 'Try goulash'], weatherInfo: 'Cool November weather', packingList: ['Swimwear', 'Flip-flops', 'Warm clothes'] },
        confidence: 90
      },
      {
        id: 'stockholm-archipelago-abba',
        title: 'Stockholm: Archipelago Tour & ABBA Museum',
        description: 'Explore Swedish archipelago and celebrate pop music history',
        country: 'Sweden',
        city: 'Stockholm',
        duration: 5,
        startDate: '2024-12-10',
        endDate: '2024-12-14',
        totalCost: { amount: 1600, currency: 'EUR', breakdown: { accommodation: 500, entertainment: 350, food: 400, transport: 350 } },
        events: [{ entertainment: this.createMockEntertainment('abba-museum', 'ABBA The Museum', 'music', 'Interactive ABBA experience'), date: '2024-12-11', time: '13:00', venue: 'Djurgården', cost: 30, currency: 'EUR' }],
        accommodation: { name: 'Stockholm Waterfront Hotel', type: 'hotel', rating: 4.6, pricePerNight: 100, location: 'Gamla Stan', amenities: ['Harbor View', 'Sauna', 'Fine Dining'] },
        transportation: { type: 'flight', details: 'Round-trip to Stockholm Arlanda', cost: 350, currency: 'EUR' },
        recommendations: { restaurants: ['Oaxen Krog', 'Meatballs for the People'], localTips: ['Buy Stockholm Pass', 'Try Swedish meatballs'], weatherInfo: 'Cold December weather, possible snow', packingList: ['Very warm clothes', 'Winter boots', 'Gloves'] },
        confidence: 93
      },
      {
        id: 'zurich-alps-chocolate',
        title: 'Zurich: Alpine Views & Swiss Chocolate Tour',
        description: 'Mountain scenery and world-famous Swiss chocolate experiences',
        country: 'Switzerland',
        city: 'Zurich',
        duration: 4,
        startDate: '2024-12-20',
        endDate: '2024-12-23',
        totalCost: { amount: 2000, currency: 'EUR', breakdown: { accommodation: 600, entertainment: 400, food: 500, transport: 500 } },
        events: [{ entertainment: this.createMockEntertainment('lindt-factory', 'Lindt Chocolate Factory Tour', 'food', 'Swiss chocolate making experience'), date: '2024-12-21', time: '10:00', venue: 'Kilchberg', cost: 45, currency: 'EUR' }],
        accommodation: { name: 'Zurich Luxury Hotel', type: 'hotel', rating: 4.8, pricePerNight: 150, location: 'City Center', amenities: ['Alpine View', 'Michelin Restaurant', 'Spa'] },
        transportation: { type: 'flight', details: 'Round-trip to Zurich Airport', cost: 500, currency: 'EUR' },
        recommendations: { restaurants: ['Kronenhalle', 'Zeughauskeller'], localTips: ['Everything is expensive', 'Try fondue', 'Take train to Alps'], weatherInfo: 'Cold winter weather, snow likely', packingList: ['Warm winter gear', 'Snow boots', 'Expensive wallet'] },
        confidence: 95
      }
    ];

    // Implement pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBundles = mockBundles.slice(startIndex, endIndex);
    const total = mockBundles.length;
    const hasMore = endIndex < total;

    return {
      bundles: paginatedBundles,
      reasoning: `Page ${page} of trip bundles offering diverse experiences based on user preferences: ${JSON.stringify(this.userData.userPreferences, null, 2)}`,
      alternatives: ['Barcelona music festival weekend', 'New York Broadway and sports', 'Berlin techno and culture tour'],
      processingTime,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    };
  }

  /**
   * Helper method to add days to a date string
   */
  private addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }
}
