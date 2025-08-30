// =============================================================================
// EXAMPLE USAGE OF TRIP BUNDLE PROMPTS SERVICE
// =============================================================================

const { TripBundlePromptService } = require('./dist/index.js');

// Example user data
const userData = {
  userPreferences: {
    budget: { min: 800, max: 2000, currency: 'EUR' },
    duration: { min: 3, max: 7 },
    preferredCountries: ['FR', 'IT', 'ES', 'GB'],
    musicGenres: ['rock', 'pop', 'electronic'],
    sportsInterests: ['football', 'tennis'],
    groupSize: 2,
    travelDates: { flexible: true }
  },
  integrations: {
    spotify: {
      summary: "Love rock music and specifically Led Zeppelin, Pink Floyd, and The Beatles. High energy, guitar-driven music preferred."
    },
    strava: {
      summary: "Active runner who enjoys marathons and cycling. Interested in sports events and outdoor activities."
    }
  }
};

async function demonstrateService() {
  console.log('🎯 Trip Bundle Prompts Service Demo\n');

  // Create service instance (requires API key for real usage)
  const service = new TripBundlePromptService(userData, {
    // apiKey: 'your-openai-api-key', // Uncomment and add your API key for real usage
    model: 'gpt-4o-mini',
    temperature: 0.7
  });

  console.log('✅ Service created with user data:');
  console.log('   - Budget: €800-2000');
  console.log('   - Duration: 3-7 days');
  console.log('   - Countries: France, Italy, Spain, UK');
  console.log('   - Music: Rock, Pop, Electronic');
  console.log('   - Sports: Football, Tennis');
  console.log('   - Integrations: Spotify (Led Zeppelin fan), Strava (runner)');
  console.log('');

  try {
    // Note: This example will fail without a valid API key
    console.log('🤖 Generating trip bundles...');
    console.log('⚠️  Note: This requires a valid OpenAI API key to work');
    const response = await service.generateTripBundles({ page: 1, limit: 3 });
    
    console.log(`✅ Generated ${response.bundles.length} trip bundles:`);
    console.log(`   Processing time: ${response.processingTime}ms`);
    console.log('');

    response.bundles.forEach((bundle, index) => {
      console.log(`📦 Bundle ${index + 1}: ${bundle.title}`);
      console.log(`   📍 ${bundle.city}, ${bundle.country}`);
      console.log(`   💰 €${bundle.totalCost.amount} (${bundle.duration} days)`);
      console.log(`   🎯 Confidence: ${bundle.confidence}%`);
      console.log(`   🎪 Events: ${bundle.events.length}`);
      bundle.events.forEach(event => {
        console.log(`      - ${event.entertainment.name} (${event.entertainment.category})`);
      });
      console.log('');
    });

    // Get events for a specific city
    console.log('🎪 Getting events for Paris...');
    const events = await service.getEvents('Paris', '2024-12-01', '2024-12-07');
    
    console.log(`✅ Found ${events.events.length} events in Paris:`);
    console.log(`   Processing time: ${events.processingTime}ms`);
    events.events.forEach(event => {
      console.log(`   🎭 ${event.entertainment.name} - €${event.cost}`);
      console.log(`      📅 ${event.date} at ${event.time}`);
      console.log(`      📍 ${event.venue}`);
    });
    console.log('');

    console.log('🎉 Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demo
demonstrateService();
