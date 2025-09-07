#!/usr/bin/env node

/**
 * Test script for the real AI service
 * This script tests the generateTripBundles function with mock user data
 * and calls the real OpenAI GPT-5-mini API
 */

import { generateTripBundles } from './dist/index.js';

// Mock user data for testing
const mockUserData = {
  userPreferences: {
    interestTypes: {
      concerts: { isEnabled: true },
      sports: { isEnabled: false },
      artDesign: { isEnabled: true },
      localCulture: { isEnabled: true },
      culinary: { isEnabled: false }
    },
    musicProfile: "I love electronic music, especially house and techno. My top artists include Disclosure, Four Tet, Caribou, and Bonobo. I enjoy both underground club scenes and larger festival experiences. I'm also into jazz fusion and experimental electronic music.",
    freeTextInterests: "I'm interested in contemporary art galleries, design museums, and local cultural events. I prefer authentic experiences over tourist traps. I enjoy exploring neighborhoods with good coffee culture and independent bookstores."
  },
  dateRange: {
    startDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days from now
    endDate: Date.now() + (90 * 24 * 60 * 60 * 1000)    // 90 days from now
  }
};

// Alternative test data for different scenarios
const alternativeUserData = {
  userPreferences: {
    interestTypes: {
      concerts: { isEnabled: true },
      sports: { isEnabled: true },
      artDesign: { isEnabled: false },
      localCulture: { isEnabled: true },
      culinary: { isEnabled: true }
    },
    musicProfile: "I'm into indie rock, alternative, and folk music. Artists like Radiohead, Bon Iver, The National, and Phoebe Bridgers are my favorites. I love intimate venue concerts and music festivals with diverse lineups.",
    freeTextInterests: "I'm a foodie who loves trying local cuisine, craft beer, and wine. I enjoy hiking, outdoor activities, and sports events. I'm interested in local history and cultural traditions."
  },
  dateRange: {
    startDate: Date.now() + (45 * 24 * 60 * 60 * 1000), // 45 days from now
    endDate: Date.now() + (120 * 24 * 60 * 60 * 1000)   // 120 days from now
  }
};

async function testRealAI() {
  console.log('🧪 Starting Real AI Service Test');
  console.log('=' .repeat(50));
  
  // Check if OpenAI API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set!');
    console.log('');
    console.log('To set up your OpenAI API key:');
    console.log('1. Get your API key from: https://platform.openai.com/api-keys');
    console.log('2. Set the environment variable:');
    console.log('   export OPENAI_API_KEY="your-api-key-here"');
    console.log('3. Run this script again');
    process.exit(1);
  }
  
  console.log('✅ OpenAI API key is set');
  console.log('🔑 API key starts with:', process.env.OPENAI_API_KEY.substring(0, 20) + '...');
  console.log('');
  
  try {
    // Test 1: Electronic music + art lover
    console.log('🎵 Test 1: Electronic Music + Art Lover');
    console.log('-'.repeat(40));
    console.log('User Profile:');
    console.log('- Interests:', Object.keys(mockUserData.userPreferences.interestTypes)
      .filter(key => mockUserData.userPreferences.interestTypes[key].isEnabled)
      .join(', '));
    console.log('- Music:', mockUserData.userPreferences.musicProfile.substring(0, 100) + '...');
    console.log('- Other:', mockUserData.userPreferences.freeTextInterests.substring(0, 100) + '...');
    console.log('');
    
    const startTime1 = Date.now();
    const result1 = await generateTripBundles(mockUserData, false); // false = real AI
    const endTime1 = Date.now();
    
    console.log(`⏱️  Request completed in ${(endTime1 - startTime1) / 1000}s`);
    console.log(`📦 Generated ${result1.bundles.length} trip bundles:`);
    
    result1.bundles.forEach((bundle, index) => {
      console.log(`\n${index + 1}. ${bundle.title}`);
      console.log(`   📍 ${bundle.city}`);
      console.log(`   📝 ${bundle.description}`);
      console.log(`   🎯 Key Events: ${bundle.keyEvents.length}`);
      console.log(`   📅 Minor Events: ${bundle.minorEvents.length}`);
      
      // Show first key event as example
      if (bundle.keyEvents.length > 0) {
        console.log(`   🎪 Example: ${bundle.keyEvents[0].title}`);
      }
    });
    
    console.log('\n' + '='.repeat(50));
    
    // Test 2: Indie rock + foodie (optional - comment out to save API costs)
    /*
    console.log('🎸 Test 2: Indie Rock + Foodie');
    console.log('-'.repeat(40));
    console.log('User Profile:');
    console.log('- Interests:', Object.keys(alternativeUserData.userPreferences.interestTypes)
      .filter(key => alternativeUserData.userPreferences.interestTypes[key].isEnabled)
      .join(', '));
    console.log('- Music:', alternativeUserData.userPreferences.musicProfile.substring(0, 100) + '...');
    console.log('- Other:', alternativeUserData.userPreferences.freeTextInterests.substring(0, 100) + '...');
    console.log('');
    
    const startTime2 = Date.now();
    const result2 = await generateTripBundles(alternativeUserData, false); // false = real AI
    const endTime2 = Date.now();
    
    console.log(`⏱️  Request completed in ${(endTime2 - startTime2) / 1000}s`);
    console.log(`📦 Generated ${result2.bundles.length} trip bundles:`);
    
    result2.bundles.forEach((bundle, index) => {
      console.log(`\n${index + 1}. ${bundle.title}`);
      console.log(`   📍 ${bundle.city}`);
      console.log(`   📝 ${bundle.description}`);
      console.log(`   🎯 Key Events: ${bundle.keyEvents.length}`);
      console.log(`   📅 Minor Events: ${bundle.minorEvents.length}`);
    });
    */
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('💡 Tip: Uncomment Test 2 in the script to run additional tests');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

// Run the test
testRealAI().catch(console.error);
