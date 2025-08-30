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
  async getEvents(city: string, startDate: string, endDate: string): Promise<EventsResponse> {
    const processingTime = Math.random() * 1000 + 500; // Simulate processing time

    // Create mock events based on the city
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
      }
    ].filter(event => event.date <= endDate); // Only include events within date range

    return {
      events: mockEvents,
      reasoning: `Found ${mockEvents.length} diverse entertainment events in ${city} between ${startDate} and ${endDate}, including music, culture, and food experiences.`,
      processingTime
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
