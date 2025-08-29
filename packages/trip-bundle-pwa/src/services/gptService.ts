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

  async generateTripBundles(systemPrompt: string, userPrompt: string = ''): Promise<GPTResponse> {
    const startTime = Date.now();

    // Check if we're in mock mode
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
    
    if (isMockMode) {
      console.log('🎭 Using mock data (VITE_MOCK=true)');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getMockResponse(Date.now() - startTime);
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





  private getMockResponse(processingTime: number): GPTResponse {
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
      }
    ];

    return {
      bundles: mockBundles,
      reasoning: 'These bundles offer diverse experiences across different cultures, combining entertainment preferences with local attractions.',
      alternatives: ['Barcelona music festival weekend', 'New York Broadway and sports', 'Berlin techno and culture tour'],
      processingTime
    };
  }

  // Utility method to validate API key
  isConfigured(): boolean {
    const isMockMode = (import.meta as any).env?.VITE_MOCK === 'true';
    // In mock mode, we're always "configured" since we use mock data
    return isMockMode || (this.apiKey !== null && this.apiKey.length > 0);
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
