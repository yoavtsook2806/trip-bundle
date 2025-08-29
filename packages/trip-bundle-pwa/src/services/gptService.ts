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
    // In a real app, this would come from environment variables or user settings
    this.apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || null;
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
        id: 'london-music-sports',
        title: 'London Music & Sports Weekend',
        description: 'Experience London with a Premier League match and West End show',
        country: 'United Kingdom',
        city: 'London',
        duration: 4,
        startDate: '2024-09-15',
        endDate: '2024-09-18',
        totalCost: {
          amount: 1200,
          currency: 'USD',
          breakdown: {
            accommodation: 480,
            entertainment: 300,
            food: 200,
            transport: 220
          }
        },
        entertainments: [
          {
            entertainment: {
              id: 'football-premier',
              name: 'Premier League Match',
              category: 'sports',
              subcategory: 'football',
              description: 'Arsenal vs Manchester United',
              averageDuration: 2,
              averageCost: { min: 50, max: 200, currency: 'USD' },
              seasonality: 'seasonal',
              popularCountries: ['GB']
            },
            date: '2024-09-16',
            time: '15:00',
            venue: 'Emirates Stadium',
            cost: 120
          },
          {
            entertainment: {
              id: 'theater-westend',
              name: 'The Lion King',
              category: 'culture',
              subcategory: 'theater',
              description: 'Award-winning West End musical',
              averageDuration: 2.5,
              averageCost: { min: 50, max: 150, currency: 'USD' },
              seasonality: 'year-round',
              popularCountries: ['GB', 'US']
            },
            date: '2024-09-17',
            time: '19:30',
            venue: 'Lyceum Theatre',
            cost: 90
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
        id: 'paris-culture-food',
        title: 'Paris Culture & Culinary Experience',
        description: 'Discover Paris through art, culture, and exquisite French cuisine',
        country: 'France',
        city: 'Paris',
        duration: 5,
        startDate: '2024-09-20',
        endDate: '2024-09-24',
        totalCost: {
          amount: 1800,
          currency: 'USD',
          breakdown: {
            accommodation: 750,
            entertainment: 400,
            food: 450,
            transport: 200
          }
        },
        entertainments: [
          {
            entertainment: {
              id: 'museum-louvre',
              name: 'Louvre Museum',
              category: 'culture',
              subcategory: 'museum',
              description: 'World-famous art museum',
              averageDuration: 4,
              averageCost: { min: 15, max: 30, currency: 'USD' },
              seasonality: 'year-round',
              popularCountries: ['FR']
            },
            date: '2024-09-21',
            time: '10:00',
            venue: 'Louvre Museum',
            cost: 25
          },
          {
            entertainment: {
              id: 'fine-dining-paris',
              name: 'Michelin Star Dinner',
              category: 'food',
              subcategory: 'restaurant',
              description: 'Exquisite French fine dining experience',
              averageDuration: 3,
              averageCost: { min: 150, max: 400, currency: 'USD' },
              seasonality: 'year-round',
              popularCountries: ['FR']
            },
            date: '2024-09-22',
            time: '20:00',
            venue: 'Le Jules Verne',
            cost: 280
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
        id: 'tokyo-music-culture',
        title: 'Tokyo Music & Traditional Culture',
        description: 'Experience modern Tokyo music scene and traditional Japanese culture',
        country: 'Japan',
        city: 'Tokyo',
        duration: 6,
        startDate: '2024-09-25',
        endDate: '2024-09-30',
        totalCost: {
          amount: 2200,
          currency: 'USD',
          breakdown: {
            accommodation: 900,
            entertainment: 500,
            food: 400,
            transport: 400
          }
        },
        entertainments: [
          {
            entertainment: {
              id: 'concert-jpop',
              name: 'J-Pop Concert',
              category: 'music',
              subcategory: 'concert',
              description: 'Live J-Pop performance at Tokyo Dome',
              averageDuration: 3,
              averageCost: { min: 80, max: 200, currency: 'USD' },
              seasonality: 'year-round',
              popularCountries: ['JP']
            },
            date: '2024-09-27',
            time: '19:00',
            venue: 'Tokyo Dome',
            cost: 150
          },
          {
            entertainment: {
              id: 'temple-visit',
              name: 'Traditional Temple Experience',
              category: 'culture',
              subcategory: 'heritage',
              description: 'Visit historic Senso-ji Temple',
              averageDuration: 2,
              averageCost: { min: 0, max: 20, currency: 'USD' },
              seasonality: 'year-round',
              popularCountries: ['JP']
            },
            date: '2024-09-28',
            time: '09:00',
            venue: 'Senso-ji Temple',
            cost: 0
          }
        ],
        accommodation: {
          name: 'Shibuya Excel Hotel Tokyu',
          type: 'hotel',
          rating: 4.3,
          pricePerNight: 150,
          location: 'Shibuya',
          amenities: ['WiFi', 'City View', 'Restaurant']
        },
        transportation: {
          type: 'flight',
          details: 'Round-trip flight',
          cost: 400
        },
        recommendations: {
          restaurants: ['Sukiyabashi Jiro', 'Ramen Yokocho'],
          localTips: ['Get JR Pass for trains', 'Learn basic Japanese phrases'],
          weatherInfo: 'Mild autumn weather',
          packingList: ['Comfortable walking shoes', 'Portable WiFi']
        },
        confidence: 85
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
    return this.apiKey !== null && this.apiKey.length > 0;
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
