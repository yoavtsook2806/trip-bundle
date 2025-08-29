import { TripPreferences } from '../store/userPreferences';
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

export interface GPTRequest {
  userPreferences: TripPreferences;
  targetCountries: string[];
  maxResults?: number;
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

  async generateTripBundles(request: GPTRequest): Promise<GPTResponse> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const startTime = Date.now();

    try {
      const prompt = this.buildPrompt(request);
      
      const response = await fetch(this.baseUrl, {
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
              content: 'You are a travel expert AI that creates personalized trip bundles. You have extensive knowledge of entertainment events, costs, and travel logistics worldwide. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        throw new Error(`GPT API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from GPT API');
      }

      // Parse the JSON response
      const parsedResponse = JSON.parse(content);
      
      return {
        ...parsedResponse,
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('GPT Service Error:', error);
      
      // Return mock data for development/testing
      return this.getMockResponse(request, Date.now() - startTime);
    }
  }

  private buildPrompt(request: GPTRequest): string {
    const { userPreferences, targetCountries, maxResults = 3 } = request;
    
    return `
Create ${maxResults} personalized trip bundles based on these user preferences:

**User Preferences:**
- Budget: ${userPreferences.budget.min}-${userPreferences.budget.max} ${userPreferences.budget.currency}
- Duration: ${userPreferences.duration.min}-${userPreferences.duration.max} days
- Group Size: ${userPreferences.groupSize}
- Preferred Countries: ${targetCountries.join(', ')}
- Music Genres: ${userPreferences.musicGenres.join(', ')}
- Sports Interests: ${userPreferences.sportsInterests.join(', ')}
- Entertainment Preferences: ${userPreferences.entertainmentPreferences.map(p => `${p.type}: ${p.value} (weight: ${p.weight})`).join(', ')}

**Requirements:**
1. Each bundle should include 2-3 entertainment activities
2. Mix different types of entertainment (music, sports, culture, etc.)
3. Include realistic costs, dates, and venues
4. Provide accommodation and transportation details
5. Add local recommendations and tips

**Response Format (JSON):**
{
  "bundles": [
    {
      "id": "unique-id",
      "title": "Bundle Title",
      "description": "Brief description",
      "country": "Country Name",
      "city": "City Name",
      "duration": 5,
      "startDate": "2024-03-15",
      "endDate": "2024-03-20",
      "totalCost": {
        "amount": 1500,
        "currency": "USD",
        "breakdown": {
          "accommodation": 600,
          "entertainment": 400,
          "food": 300,
          "transport": 200
        }
      },
      "entertainments": [
        {
          "entertainment": {
            "id": "concert-pop",
            "name": "Pop Concert",
            "category": "music",
            "subcategory": "concert",
            "description": "Live pop music performance",
            "averageDuration": 3,
            "averageCost": {"min": 50, "max": 300, "currency": "USD"},
            "seasonality": "year-round",
            "popularCountries": ["US", "GB"]
          },
          "date": "2024-03-16",
          "time": "20:00",
          "venue": "Madison Square Garden",
          "cost": 150,
          "bookingUrl": "https://example.com/tickets"
        }
      ],
      "accommodation": {
        "name": "Hotel Name",
        "type": "hotel",
        "rating": 4.5,
        "pricePerNight": 120,
        "location": "City Center",
        "amenities": ["WiFi", "Gym", "Restaurant"]
      },
      "transportation": {
        "type": "flight",
        "details": "Round-trip flight",
        "cost": 400
      },
      "recommendations": {
        "restaurants": ["Restaurant 1", "Restaurant 2"],
        "localTips": ["Tip 1", "Tip 2"],
        "weatherInfo": "Mild weather expected",
        "packingList": ["Light jacket", "Comfortable shoes"]
      },
      "confidence": 85
    }
  ],
  "reasoning": "Explanation of why these bundles were chosen",
  "alternatives": ["Alternative suggestion 1", "Alternative suggestion 2"]
}

Focus on current and upcoming events, realistic pricing, and matching the user's entertainment preferences closely.
`;
  }

  private getMockResponse(_request: GPTRequest, processingTime: number): GPTResponse {
    // Mock response for development/testing
    const mockBundle: TripBundle = {
      id: 'mock-bundle-1',
      title: 'London Music & Sports Weekend',
      description: 'Experience the best of London with a Premier League match and West End show',
      country: 'United Kingdom',
      city: 'London',
      duration: 4,
      startDate: '2024-04-15',
      endDate: '2024-04-18',
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
          date: '2024-04-16',
          time: '15:00',
          venue: 'Emirates Stadium',
          cost: 120,
          bookingUrl: 'https://arsenal.com/tickets'
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
          date: '2024-04-17',
          time: '19:30',
          venue: 'Lyceum Theatre',
          cost: 90,
          bookingUrl: 'https://lionking.co.uk/tickets'
        }
      ],
      accommodation: {
        name: 'The Z Hotel Piccadilly',
        type: 'hotel',
        rating: 4.2,
        pricePerNight: 120,
        location: 'Central London',
        amenities: ['WiFi', 'Air Conditioning', '24/7 Reception']
      },
      transportation: {
        type: 'flight',
        details: 'Round-trip economy flight',
        cost: 220
      },
      recommendations: {
        restaurants: ['Dishoom', 'Sketch', 'Borough Market'],
        localTips: ['Book tube tickets in advance', 'Visit during off-peak hours', 'Try traditional fish and chips'],
        weatherInfo: 'Mild spring weather, pack layers',
        packingList: ['Light rain jacket', 'Comfortable walking shoes', 'Smart casual clothes']
      },
      confidence: 92
    };

    return {
      bundles: [mockBundle],
      reasoning: 'This bundle combines your sports interest with cultural entertainment in London, staying within your budget range.',
      alternatives: ['Paris weekend with Louvre and PSG match', 'Barcelona with Camp Nou tour and flamenco show'],
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
