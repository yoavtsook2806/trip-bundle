// =============================================================================
// TRIP BUNDLE PROMPT SERVICE - Main Service Class
// =============================================================================

import { 
  UserData, 
  GPTResponse, 
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
