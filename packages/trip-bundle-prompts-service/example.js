// =============================================================================
// EXAMPLE USAGE OF TRIP BUNDLE PROMPTS SERVICE
// =============================================================================

import { generateTripBundles } from './dist/index.js';

// Example user data matching the current API
const mockUserData = {
  userPreferences: {
    interestTypes: {
      concerts: { isEnabled: true },
      sports: { isEnabled: false },
      artDesign: { isEnabled: true },
      localCulture: { isEnabled: true },
      culinary: { isEnabled: false }
    },
    musicProfile: "I love electronic music, especially house and techno. My top artists include Disclosure, Four Tet, Caribou, and Bonobo. I enjoy both underground club scenes and larger festival experiences.",
    freeTextInterests: "I'm interested in contemporary art galleries, design museums, and local cultural events. I prefer authentic experiences over tourist traps."
  },
  dateRange: {
    startDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: Date.now() + (90 * 24 * 60 * 60 * 1000)    // 90 days from now
  }
};

async function demonstrateService() {
  console.log('🎯 Trip Bundle Prompts Service Demo (Mock Mode)\n');

  console.log('✅ Using mock data:');
  console.log('   - Interests: concerts, artDesign, localCulture');
  console.log('   - Music: Electronic, House, Techno');
  console.log('   - Date Range: Next 30-90 days');
  console.log('');

  try {
    console.log('🤖 Generating trip bundles with mock AI...');
    
    // Use mock mode (isMock = true)
    const response = await generateTripBundles(mockUserData, true);
    
    console.log(`✅ Generated ${response.bundles.length} trip bundles:`);
    console.log('');

    response.bundles.forEach((bundle, index) => {
      console.log(`📦 Bundle ${index + 1}: ${bundle.title}`);
      console.log(`   📍 ${bundle.city}`);
      console.log(`   📝 ${bundle.description}`);
      console.log(`   🎯 Key Events: ${bundle.keyEvents.length}`);
      console.log(`   📅 Minor Events: ${bundle.minorEvents.length}`);
      
      // Show first key event as example
      if (bundle.keyEvents.length > 0) {
        console.log(`   🎪 Example: ${bundle.keyEvents[0].title}`);
      }
      console.log('');
    });

    console.log('🎉 Mock demo completed successfully!');
    console.log('💡 To test with real AI, set OPENAI_API_KEY and use isMock=false');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  }
}

// Run the demo
demonstrateService();
