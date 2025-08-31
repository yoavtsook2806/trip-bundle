import { 
  ITripBundleService, 
  GPTResponse, 
  EventsResponse, 
  UserData,
  GenerationOptions 
} from 'trip-bundle-prompts-service';

/**
 * Wrapper service that adds logging to all prompt service calls
 */
export class LoggingTripBundleService implements ITripBundleService {
  constructor(private wrappedService: ITripBundleService) {}

  updateUserData(userData: UserData): void {
    console.log('📝 [PROMPT_SERVICE] updateUserData called with userData:', userData);
    this.wrappedService.updateUserData(userData);
  }

  isConfigured(): boolean {
    console.log('🔧 [PROMPT_SERVICE] isConfigured called');
    return this.wrappedService.isConfigured();
  }

  async generateTripBundles(options?: GenerationOptions): Promise<GPTResponse> {
    console.log('🚀 [PROMPT_SERVICE] generateTripBundles called with options:', options);
    console.time('🚀 [PROMPT_SERVICE] generateTripBundles duration');
    
    try {
      const result = await this.wrappedService.generateTripBundles(options);
      console.log('✅ [PROMPT_SERVICE] generateTripBundles completed successfully');
      console.log('📊 [PROMPT_SERVICE] Generated bundles count:', result.bundles.length);
      console.timeEnd('🚀 [PROMPT_SERVICE] generateTripBundles duration');
      return result;
    } catch (error) {
      console.error('❌ [PROMPT_SERVICE] generateTripBundles failed:', error);
      console.timeEnd('🚀 [PROMPT_SERVICE] generateTripBundles duration');
      throw error;
    }
  }

  async getEvents(city: string, startDate: string, endDate: string, options?: { page?: number; limit?: number }): Promise<EventsResponse> {
    console.log('🎪 [PROMPT_SERVICE] getEvents called with params:', { city, startDate, endDate, options });
    console.time('🎪 [PROMPT_SERVICE] getEvents duration');
    
    try {
      const result = await this.wrappedService.getEvents(city, startDate, endDate, options);
      console.log('✅ [PROMPT_SERVICE] getEvents completed successfully');
      console.log('📊 [PROMPT_SERVICE] Events count:', result.events.length);
      console.log('📊 [PROMPT_SERVICE] Pagination info:', result.pagination);
      console.timeEnd('🎪 [PROMPT_SERVICE] getEvents duration');
      return result;
    } catch (error) {
      console.error('❌ [PROMPT_SERVICE] getEvents failed:', error);
      console.timeEnd('🎪 [PROMPT_SERVICE] getEvents duration');
      throw error;
    }
  }

  // Proxy methods for accessing prompts (if the wrapped service supports them)
  getSystemPrompt?(): string {
    console.log('📝 [PROMPT_SERVICE] getSystemPrompt called');
    if ('getSystemPrompt' in this.wrappedService && typeof this.wrappedService.getSystemPrompt === 'function') {
      const result = this.wrappedService.getSystemPrompt();
      console.log('📝 [PROMPT_SERVICE] getSystemPrompt result length:', result.length);
      return result;
    }
    throw new Error('getSystemPrompt not supported by wrapped service');
  }

  getUserPrompt?(): string {
    console.log('📝 [PROMPT_SERVICE] getUserPrompt called');
    if ('getUserPrompt' in this.wrappedService && typeof this.wrappedService.getUserPrompt === 'function') {
      const result = this.wrappedService.getUserPrompt();
      console.log('📝 [PROMPT_SERVICE] getUserPrompt result length:', result.length);
      return result;
    }
    throw new Error('getUserPrompt not supported by wrapped service');
  }
}
