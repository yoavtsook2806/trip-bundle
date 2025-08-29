import { Entertainment } from '../constants/entertainments';

export interface TripBundle {
  id: string;
  title: string;
  description: string;
  country: string;
  city: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  totalCost: {
    amount: number;
    currency: string;
    breakdown: {
      accommodation: number;
      entertainment: number;
      food: number;
      transport: number;
    };
  };
  entertainments: {
    entertainment: Entertainment;
    date: string;
    time: string;
    venue: string;
    cost: number;
    bookingUrl?: string;
  }[];
  accommodation: {
    name: string;
    type: 'hotel' | 'hostel' | 'apartment' | 'resort';
    rating: number;
    pricePerNight: number;
    location: string;
    amenities: string[];
  };
  transportation: {
    type: 'flight' | 'train' | 'bus' | 'car';
    details: string;
    cost: number;
  };
  recommendations: {
    restaurants: string[];
    localTips: string[];
    weatherInfo: string;
    packingList: string[];
  };
  confidence: number; // 0-100 how well it matches user preferences
}



export interface GPTResponse {
  bundles: TripBundle[];
  reasoning: string;
  alternatives: string[];
  processingTime: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

class GPTService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // Initialize API key from environment variable (only if not in mock mode)
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
    this.apiKey = isMockMode ? null : ((import.meta as any).env?.VITE_OPENAI_API_KEY || null);
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async generateTripBundles(
    systemPrompt: string, 
    userPrompt: string = '', 
    options: { page?: number; limit?: number } = {}
  ): Promise<GPTResponse> {
    const { page = 1, limit = 5 } = options;
    const startTime = Date.now();

    // Check if we're in mock mode
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
    
    if (isMockMode) {
      console.log(`🎭 Using mock data (VITE_MOCK=true) - Page ${page}, Limit ${limit}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getMockResponse(Date.now() - startTime, page, limit);
    }

    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
    }

    try {
      console.log('🤖 Calling OpenAI API...');
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Using the more cost-effective model
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt || 'Please generate a trip bundle suggestion.'
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: 'json_object' } // Ensure JSON response
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from OpenAI API');
      }

      console.log('✅ OpenAI API response received');

      // Parse the JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response as JSON:', content);
        throw new Error('OpenAI returned invalid JSON response');
      }
      
      return {
        ...parsedResponse,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ GPT Service Error:', error);
      throw error; // Don't fall back to mock data, let the error bubble up
    }
  }





  // Helper function to create complete entertainment objects for mock data
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
        entertainments: [
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
            cost: 280
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
            cost: 450
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
          cost: 220
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
        entertainments: [
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
            cost: 600
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
            cost: 380
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
          cost: 200
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
        entertainments: [
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
            cost: 650
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
            cost: 280
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
          cost: 280
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
        entertainments: [
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
            cost: 520
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
            cost: 320
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
          cost: 200
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
        entertainments: [
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
            cost: 65
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
            cost: 140
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
          cost: 200
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
        entertainments: [
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
            cost: 180
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
            cost: 35
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
          cost: 180
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
        entertainments: [
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
            cost: 25
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
            cost: 35
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
          cost: 150
        },
        recommendations: {
          restaurants: ['Lokál', 'Café Savoy'],
          localTips: ['Learn to say "Na zdraví" (Cheers)', 'Walk across Charles Bridge at sunrise'],
          weatherInfo: 'Cool autumn weather',
          packingList: ['Warm jacket', 'Camera for architecture']
        },
        confidence: 89
      },
      // Additional bundles for pagination testing (8-20)
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('anime-expo-tokyo', 'Tokyo Anime Expo 2024', 'culture', 'Largest anime convention in Asia'),
            date: '2024-10-12',
            time: '10:00',
            venue: 'Tokyo Big Sight',
            cost: 80
          },
          {
            entertainment: this.createMockEntertainment('sumo-tournament', 'Grand Sumo Tournament', 'sports', 'Traditional Japanese sumo wrestling'),
            date: '2024-10-14',
            time: '16:00',
            venue: 'Ryogoku Kokugikan',
            cost: 120
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
          cost: 400
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('hamilton-broadway', 'Hamilton', 'culture', 'Award-winning Broadway musical'),
            date: '2024-11-21',
            time: '20:00',
            venue: 'Richard Rodgers Theatre',
            cost: 200
          },
          {
            entertainment: this.createMockEntertainment('knicks-vs-lakers', 'Knicks vs Lakers', 'sports', 'NBA basketball game'),
            date: '2024-11-23',
            time: '19:30',
            venue: 'Madison Square Garden',
            cost: 150
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
          cost: 300
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('opera-house-gala', 'Sydney Opera House Gala', 'culture', 'Prestigious opera performance'),
            date: '2024-12-03',
            time: '19:30',
            venue: 'Sydney Opera House',
            cost: 180
          },
          {
            entertainment: this.createMockEntertainment('bondi-surfing', 'Bondi Beach Surfing Lessons', 'adventure', 'Learn to surf at famous Bondi Beach'),
            date: '2024-12-05',
            time: '09:00',
            venue: 'Bondi Beach',
            cost: 80
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
          cost: 500
        },
        recommendations: {
          restaurants: ['Quay Restaurant', 'Bennelong', 'Fish Market'],
          localTips: ['Sun protection essential', 'Tipping not required', 'Watch for wildlife'],
          weatherInfo: 'Summer season, warm and sunny',
          packingList: ['Sunscreen', 'Swimwear', 'Light summer clothes', 'Hat']
        },
        confidence: 91
      },
      // More bundles (11-20)
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('berghain-techno', 'Berghain Techno Night', 'nightlife', 'World famous techno club'),
            date: '2024-09-26',
            time: '23:00',
            venue: 'Berghain',
            cost: 25
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
          cost: 400
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('hagia-sophia', 'Hagia Sophia Tour', 'culture', 'Historic Byzantine cathedral'),
            date: '2024-10-06',
            time: '10:00',
            venue: 'Hagia Sophia',
            cost: 50
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
          cost: 200
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
        entertainments: [
          {
            entertainment: this.createMockEntertainment('northern-lights-tour', 'Northern Lights Tour', 'nature', 'Aurora Borealis viewing experience'),
            date: '2024-11-16',
            time: '20:00',
            venue: 'Outside Reykjavik',
            cost: 120
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
          cost: 400
        },
        recommendations: {
          restaurants: ['Dill Restaurant', 'Bæjarins Beztu Pylsur', 'Café Loki'],
          localTips: ['Dress very warmly', 'Book tours early', 'Try local fish'],
          weatherInfo: 'Cold November weather, possible snow',
          packingList: ['Warm winter clothes', 'Waterproof jacket', 'Thermal underwear']
        },
        confidence: 94
      },
      // Bundles 14-20 (compact format for brevity)
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
        entertainments: [{ entertainment: this.createMockEntertainment('irish-music', 'Traditional Irish Music Night', 'music', 'Authentic Irish folk music'), date: '2024-10-21', time: '20:00', venue: 'Temple Bar', cost: 30 }],
        accommodation: { name: 'Dublin City Hotel', type: 'hotel', rating: 4.1, pricePerNight: 80, location: 'Temple Bar', amenities: ['Free WiFi', 'Pub', 'Breakfast'] },
        transportation: { type: 'flight', details: 'Round-trip to Dublin Airport', cost: 280 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('fado-night', 'Fado Performance', 'music', 'Traditional Portuguese music'), date: '2024-11-02', time: '21:00', venue: 'Alfama District', cost: 40 }],
        accommodation: { name: 'Lisbon Heritage Hotel', type: 'hotel', rating: 4.3, pricePerNight: 70, location: 'Alfama', amenities: ['Rooftop Terrace', 'Traditional Decor'] },
        transportation: { type: 'flight', details: 'Round-trip to Lisbon Airport', cost: 200 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('design-museum', 'Design Museum Denmark', 'culture', 'Danish design exhibition'), date: '2024-10-01', time: '10:00', venue: 'Bredgade', cost: 25 }],
        accommodation: { name: 'Copenhagen Design Hotel', type: 'hotel', rating: 4.5, pricePerNight: 120, location: 'Vesterbro', amenities: ['Modern Design', 'Bike Rental', 'Eco-Friendly'] },
        transportation: { type: 'flight', details: 'Round-trip to Copenhagen Airport', cost: 400 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('wawel-castle', 'Wawel Castle Tour', 'culture', 'Medieval royal castle'), date: '2024-10-16', time: '11:00', venue: 'Wawel Hill', cost: 20 }],
        accommodation: { name: 'Krakow Old Town Hotel', type: 'hotel', rating: 4.2, pricePerNight: 60, location: 'Old Town', amenities: ['Historic Building', 'Central Location'] },
        transportation: { type: 'flight', details: 'Round-trip to Krakow Airport', cost: 180 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('szechenyi-baths', 'Széchenyi Thermal Baths', 'nature', 'Historic thermal spa complex'), date: '2024-11-11', time: '14:00', venue: 'City Park', cost: 25 }],
        accommodation: { name: 'Budapest River Hotel', type: 'hotel', rating: 4.4, pricePerNight: 70, location: 'Pest Side', amenities: ['River View', 'Spa Access'] },
        transportation: { type: 'flight', details: 'Round-trip to Budapest Airport', cost: 300 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('abba-museum', 'ABBA The Museum', 'music', 'Interactive ABBA experience'), date: '2024-12-11', time: '13:00', venue: 'Djurgården', cost: 30 }],
        accommodation: { name: 'Stockholm Waterfront Hotel', type: 'hotel', rating: 4.6, pricePerNight: 100, location: 'Gamla Stan', amenities: ['Harbor View', 'Sauna', 'Fine Dining'] },
        transportation: { type: 'flight', details: 'Round-trip to Stockholm Arlanda', cost: 350 },
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
        entertainments: [{ entertainment: this.createMockEntertainment('lindt-factory', 'Lindt Chocolate Factory Tour', 'food', 'Swiss chocolate making experience'), date: '2024-12-21', time: '10:00', venue: 'Kilchberg', cost: 45 }],
        accommodation: { name: 'Zurich Luxury Hotel', type: 'hotel', rating: 4.8, pricePerNight: 150, location: 'City Center', amenities: ['Alpine View', 'Michelin Restaurant', 'Spa'] },
        transportation: { type: 'flight', details: 'Round-trip to Zurich Airport', cost: 500 },
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
      reasoning: `Page ${page} of trip bundles offering diverse experiences across different cultures, combining entertainment preferences with local attractions.`,
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

  // Utility method to validate API key
  isConfigured(): boolean {
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
    // In mock mode, we're always "configured" since we use mock data
    return isMockMode || (this.apiKey !== null && this.apiKey.length > 0);
  }

  // Method to get events for a specific city and date range
  async getEvents(city: string, startDate: string, endDate: string): Promise<{
    events: {
      entertainment: Entertainment;
      date: string;
      time: string;
      venue: string;
      cost: number;
      currency: string;
      bookingUrl?: string;
    }[];
    reasoning: string;
    processingTime: number;
  }> {
    const startTime = Date.now();
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';

    if (isMockMode || !this.isConfigured()) {
      // Return mock events for the specified city and date range
      return this.getMockEvents(city, startDate, endDate);
    }

    try {
      const prompt = `Find entertainment events in ${city} between ${startDate} and ${endDate}.
      
Please provide a list of events with the following information for each:
- Event name and description
- Category (music, sports, culture, food, nightlife, nature, adventure)
- Date and time
- Venue/location
- Estimated cost in EUR
- Booking URL if available

Focus on diverse entertainment options that would appeal to travelers.

Return the response in this JSON format:
{
  "events": [
    {
      "name": "Event Name",
      "description": "Event description",
      "category": "music",
      "date": "2024-01-15",
      "time": "19:00",
      "venue": "Venue Name",
      "cost": 50,
      "bookingUrl": "https://example.com/book"
    }
  ],
  "reasoning": "Brief explanation of event selection"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a travel expert specializing in finding entertainment events in cities worldwide. Provide accurate, current information about events and activities.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(content);
      const processingTime = Date.now() - startTime;

      // Convert to our format
      const events = parsedResponse.events.map((event: any) => ({
        entertainment: {
          id: event.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: event.name,
          description: event.description,
          category: event.category,
          tags: [],
          duration: 120 // Default duration in minutes
        },
        date: event.date,
        time: event.time,
        venue: event.venue,
        cost: event.cost,
        currency: 'EUR',
        bookingUrl: event.bookingUrl
      }));

      return {
        events,
        reasoning: parsedResponse.reasoning,
        processingTime
      };

    } catch (error) {
      console.error('Error fetching events from GPT:', error);
      // Fallback to mock data on error
      return this.getMockEvents(city, startDate, endDate);
    }
  }

  // Mock events for development
  private getMockEvents(city: string, startDate: string, endDate: string): {
    events: {
      entertainment: Entertainment;
      date: string;
      time: string;
      venue: string;
      cost: number;
      currency: string;
      bookingUrl?: string;
    }[];
    reasoning: string;
    processingTime: number;
  } {
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

  // Helper method to add days to a date string
  private addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Method to get available models (for future use)
  async getAvailableModels(): Promise<string[]> {
    if (!this.apiKey) {
      return ['gpt-4', 'gpt-3.5-turbo']; // Default models
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const data = await response.json();
      return data.data.map((model: any) => model.id);
    } catch (error) {
      console.error('Error fetching models:', error);
      return ['gpt-4', 'gpt-3.5-turbo'];
    }
  }
}

export default GPTService;
