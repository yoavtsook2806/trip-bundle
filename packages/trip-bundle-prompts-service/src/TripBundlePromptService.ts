// =============================================================================
// TRIP BUNDLE PROMPT SERVICE - Main Service Class
// =============================================================================

import { 
  UserData, 
  GPTResponse, 
  EventsResponse, 
  ServiceConfig, 
  GenerationOptions,
  TripBundle,
  Event,
  Entertainment
} from './types';
import { getSystemPrompt, getUserPrompt } from './prompts';

/**
 * Main service class for generating trip bundles using GPT
 * Handles prompt generation and GPT API communication
 */
export class TripBundlePromptService {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';
  private mockMode: boolean = false;
  private model: string = 'gpt-4o-mini';
  private temperature: number = 0.7;
  private maxTokens: number = 4000;
  private userData: UserData;

  constructor(userData: UserData, config?: ServiceConfig) {
    this.userData = userData;
    
    if (config) {
      this.apiKey = config.apiKey || null;
      this.mockMode = config.mockMode || false;
      this.baseUrl = config.baseUrl || this.baseUrl;
      this.model = config.model || this.model;
      this.temperature = config.temperature || this.temperature;
      this.maxTokens = config.maxTokens || this.maxTokens;
    }
  }

  /**
   * Set API key for OpenAI
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Update user data
   */
  updateUserData(userData: UserData): void {
    this.userData = userData;
  }

  /**
   * Generate trip bundles based on user data
   */
  async generateTripBundles(options: GenerationOptions = {}): Promise<GPTResponse> {
    const { page = 1, limit = 5 } = options;
    const startTime = Date.now();

    // Check if we're in mock mode
    if (this.mockMode) {
      console.log(`🎭 Using mock data (mockMode=true) - Page ${page}, Limit ${limit}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return this.getMockResponse(Date.now() - startTime, page, limit);
    }

    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set API key using setApiKey() method.');
    }

    try {
      console.log('🤖 Calling OpenAI API...');
      
      const systemPrompt = getSystemPrompt();
      const userPrompt = getUserPrompt(this.userData);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
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
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          response_format: { type: 'json_object' } // Ensure JSON response
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as any;
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
      }

      const data = await response.json() as any;
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

  /**
   * Get events for a specific city and date range
   */
  async getEvents(city: string, startDate: string, endDate: string): Promise<EventsResponse> {
    const startTime = Date.now();

    if (this.mockMode || !this.isConfigured()) {
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

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
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
          temperature: this.temperature,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as any;
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

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    // In mock mode, we're always "configured" since we use mock data
    return this.mockMode || (this.apiKey !== null && this.apiKey.length > 0);
  }

  // =============================================================================
  // PRIVATE METHODS - Mock Data and Utilities
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
   * Mock events for development
   */
  private getMockEvents(city: string, startDate: string, endDate: string): EventsResponse {
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
      }
    ].filter(event => event.date <= endDate); // Only include events within date range

    return {
      events: mockEvents,
      reasoning: `Found ${mockEvents.length} diverse entertainment events in ${city} between ${startDate} and ${endDate}, including music, culture, and food experiences.`,
      processingTime
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
