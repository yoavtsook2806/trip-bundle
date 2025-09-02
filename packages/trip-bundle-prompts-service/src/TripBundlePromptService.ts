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
  console.log('👤 User preferences:', Object.keys(userData.userPreferences.interestTypes).filter(key => 
    userData.userPreferences.interestTypes[key as keyof typeof userData.userPreferences.interestTypes].isEnabled
  ));
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
 * Generates a list of excluded events from existing bundles
 */
const generateExcludedEvents = (existingBundles: TripBundle[]): string => {
  if (existingBundles.length === 0) {
    return 'None';
  }

  const excludedEvents: string[] = [];
  
  existingBundles.forEach(bundle => {
    // Add key events from existing bundles to excluded list
    if (bundle.keyEvents && bundle.keyEvents.events) {
      bundle.keyEvents.events.forEach(event => {
        excludedEvents.push(`${event.title} (${event.venue})`);
      });
    }
    
    // Add minor events from existing bundles to excluded list
    if (bundle.minorEvents && bundle.minorEvents.events) {
      bundle.minorEvents.events.forEach(event => {
        excludedEvents.push(`${event.title} (${event.venue})`);
      });
    }
    
    // Also include the bundle location/city as a general exclusion
    excludedEvents.push(`Events in ${bundle.city} (already covered by ${bundle.title})`);
  });

  return excludedEvents.join(', ');
};

/**
 * Creates a user prompt for AI based on user data and existing bundles
 */
const createUserPrompt = (userData: UserData, existingBundles: TripBundle[]): string => {
  // Format interests into readable text
  const interests = Object.entries(userData.userPreferences.interestTypes)
    .filter(([_, isSelected]) => isSelected)
    .map(([interest, _]) => interest)
    .join(', ');

  // Format music profile
  const musicProfile = userData.userPreferences.musicProfile || 'No music preferences specified';

  // Format free text interests
  const freeTextInterests = userData.userPreferences.freeTextInterests || 'No additional interests specified';

  // Generate excluded events from existing bundles
  const excludedEvents = generateExcludedEvents(existingBundles);

  // Format date range
  const startDate = new Date(userData.dateRange.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const endDate = new Date(userData.dateRange.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateRange = `From ${startDate} to ${endDate}`;

  // Create the formatted prompt
  const userPrompt = `User taste profile (provided by the user):
1. Interested in: ${interests}
2. Music profile: ${musicProfile}
3. Free text: ${freeTextInterests}
4. Excluded events: ${excludedEvents}
Date range:
${dateRange}`;

  // Log the user prompt
  console.log('🎯 [USER_PROMPT] Generated user prompt:', userPrompt);

  return userPrompt;
};

// For backward compatibility, also export as default
export default generateTripBundles;