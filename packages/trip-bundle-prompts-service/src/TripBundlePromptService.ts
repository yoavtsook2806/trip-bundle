// =============================================================================
// TRIP BUNDLE PROMPT SERVICE - Simple Function Interface
// =============================================================================

import { 
  UserData, 
  GPTResponse, 
  GenerationOptions,
  TripBundle,
  Event,
  Entertainment,
  GenerateTripBundlesFunction
} from './types';
import { getSystemPrompt, getUserPrompt } from './prompts';

/**
 * Simple function to generate trip bundles using GPT
 * Takes userData and cities, returns trip bundles
 */
export const generateTripBundles: GenerateTripBundlesFunction = async (
  userData: UserData,
  cities: string[],
  options: GenerationOptions = {}
): Promise<GPTResponse> => {
  const apiKey = (globalThis as any).VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const { page = 1, limit = 5, forceRefresh = false } = options;
  
  console.log(`🤖 Generating trip bundles for user preferences`);
  console.log(`📊 Options:`, { page, limit, forceRefresh });
  
  try {
    // Generate prompts
    const systemPrompt = getSystemPrompt(cities);
    const userPrompt = getUserPrompt(userData, cities);
    
    console.log(`📝 System prompt length: ${systemPrompt.length}`);
    console.log(`📝 User prompt length: ${userPrompt.length}`);
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const result: any = await response.json();
    
    if (!result.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI API');
    }

    // Parse the JSON response
    let parsedContent: any;
    try {
      parsedContent = JSON.parse(result.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse GPT response as JSON:', result.choices[0].message.content);
      throw new Error('Invalid JSON response from GPT');
    }

    // Validate and structure the response
    const gptResponse: GPTResponse = {
      bundles: parsedContent.bundles || [],
      reasoning: parsedContent.reasoning || 'Trip bundles generated based on your preferences',
      alternatives: parsedContent.alternatives || [],
      totalResults: parsedContent.bundles?.length || 0,
      pagination: {
        page,
        limit,
        total: parsedContent.bundles?.length || 0,
        hasMore: false // Simple implementation - no pagination for now
      }
    };

    console.log(`✅ Successfully generated ${gptResponse.bundles.length} trip bundles`);
    return gptResponse;

  } catch (error) {
    console.error('❌ Error generating trip bundles:', error);
    throw error;
  }
};

// For backward compatibility, also export as default
export default generateTripBundles;