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
  private model: string = 'gpt-4o-mini';
  private temperature: number = 0.7;
  private maxTokens: number = 4000;
  private userData: UserData;
  private cities: string[];

  constructor(userData: UserData, cities: string[], config?: ServiceConfig) {
    this.userData = userData;
    this.cities = cities;
    
    if (config) {
      this.apiKey = config.apiKey || null;
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
    const startTime = Date.now();

    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set API key using setApiKey() method.');
    }

    try {
      console.log('🤖 Calling OpenAI API...');
      
      const systemPrompt = getSystemPrompt(this.cities);
      const userPrompt = getUserPrompt(this.userData, this.cities);

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
  async getEvents(city: string, startDate: string, endDate: string, options: { page?: number; limit?: number } = {}): Promise<EventsResponse> {
    const startTime = Date.now();

    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set API key using setApiKey() method.');
    }

    try {
      const { page = 1, limit = 10 } = options;
      const prompt = `Find entertainment events in ${city} between ${startDate} and ${endDate}.
      
Please provide a list of events with the following information for each:
- Event name and description
- Category (music, sports, culture, food, nightlife, nature, adventure)
- Date and time
- Venue/location
- Estimated cost in EUR
- Booking URL if available

Focus on diverse entertainment options that would appeal to travelers.
Return page ${page} with up to ${limit} events per page.

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
  "reasoning": "Brief explanation of event selection",
  "pagination": {
    "page": ${page},
    "limit": ${limit},
    "total": 50,
    "hasMore": true
  }
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
        processingTime,
        pagination: parsedResponse.pagination
      };

    } catch (error) {
      console.error('Error fetching events from GPT:', error);
      throw error;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.length > 0;
  }

  /**
   * Get the current system prompt
   */
  getSystemPrompt(): string {
    return getSystemPrompt(this.cities);
  }

  /**
   * Get the current user prompt
   */
  getUserPrompt(): string {
    return getUserPrompt(this.userData, this.cities);
  }
}
