import { UserData, GPTResponse, TripBundle, GenerateTripBundlesFunction } from './types';
import { getBundlesFromAi as getMockBundlesFromAi } from './AiMockService';
import { getBundlesFromAi as getRealBundlesFromAi } from './AiService';

/**
 * Generates trip bundles - either mock data or real API call
 */
export const generateTripBundles: GenerateTripBundlesFunction = async (
  userData: UserData,
  isMock: boolean = true,
  existingBundles: TripBundle[] = []
): Promise<GPTResponse> => {
  console.log('🎯 Generating trip bundles...');
  console.log('📍 Mode:', isMock ? 'Mock AI' : 'Real AI');
  console.log('👤 User preferences:', userData.userPreferences.interests);
  console.log('📅 Date range:', `${userData.dateRange.startDate} to ${userData.dateRange.endDate}`);
  console.log('📦 Existing bundles to filter:', existingBundles.map(b => `${b.id}: ${b.title}`));
  
  // Create user prompt for AI
  const userPrompt = createUserPrompt(userData, existingBundles);
  console.log('📝 Generated user prompt for AI');
  
  if (isMock) {
    console.log('⏳ Simulating AI processing time (5 seconds)...');
    // Simulate AI processing delay for mock mode
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🤖 Calling Mock AI Service...');
    const bundles = await getMockBundlesFromAi(userPrompt, existingBundles);
    
    console.log(`✅ Mock AI generated ${bundles.length} new trip bundles`);
    return { bundles };
  } else {
    console.log('🚀 Calling Real AI Service...');
    const bundles = await getRealBundlesFromAi(userPrompt, existingBundles);
    
    console.log(`✅ Real AI generated ${bundles.length} new trip bundles`);
    return { bundles };
  }
};

/**
 * Creates a user prompt for AI based on user data and existing bundles
 */
const createUserPrompt = (userData: UserData, existingBundles: TripBundle[]): string => {
  // TODO: Implement sophisticated prompt generation logic
  // This should create a detailed prompt for the AI that includes:
  // - User preferences and interests
  // - Date range and travel details
  // - Context about existing bundles to avoid duplicates
  // - Specific instructions for the AI response format
  
  const promptData = {
    userData,
    existingBundles: existingBundles.map(b => ({ id: b.id, title: b.title, city: b.city }))
  };
  
  return JSON.stringify(promptData);
};

// For backward compatibility, also export as default
export default generateTripBundles;