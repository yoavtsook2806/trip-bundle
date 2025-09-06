import { UserData, GPTResponse, TripBundle, GenerateTripBundlesFunction } from './types.js';
import { getBundlesFromAi as getMockBundlesFromAi } from './AiMockService.js';
import { getBundlesFromAi as getRealBundlesFromAi } from './AiService.js';
import { createUserPrompt } from './prompt.js';

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
  console.log('👤 User preferences:', Object.keys(userData.userPreferences.interestTypes).filter(key => 
    userData.userPreferences.interestTypes[key as keyof typeof userData.userPreferences.interestTypes].isEnabled
  ));
  console.log('📅 Date range:', `${userData.dateRange.startDate} to ${userData.dateRange.endDate}`);
  console.log('📦 Existing bundles to filter:', existingBundles.map(b => b.title));
  
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
    const response = { bundles };
    console.log('📋 GPTResponse:', JSON.stringify(response, null, 2));
    return response;
  } else {
    console.log('🚀 Calling Real AI Service...');
    const {bundles} = await getRealBundlesFromAi(userPrompt);
    
    console.log(`✅ Real AI generated ${bundles.length} new trip bundles`);
    const response = { bundles };
    console.log('📋 GPTResponse:', JSON.stringify(response, null, 2));
    return response;
  }
};



// For backward compatibility, also export as default
export default generateTripBundles;