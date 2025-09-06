import OpenAI from 'openai';
import { GPTResponse } from './types.js';
import { createSystemPrompt } from './prompt.js';

/**
 * Real AI service that calls actual AI APIs for trip bundle generation
 */

// Initialize OpenAI client  
const openai = new OpenAI({
  apiKey: (process.env as any).OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser usage
});

/**
 * Parse AI response JSON into GPTResponse object
 */
const parseAiResponse = (responseText: string): GPTResponse => {
  console.log('🔍 [AI_PARSER] Parsing AI JSON response...');
  console.log('📝 [AI_PARSER] Raw response length:', responseText.length);
  
  try {
    // Clean the response text - remove any markdown formatting if present
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON
    const parsedResponse: GPTResponse = JSON.parse(cleanedResponse);
    
    // Validate the response structure
    if (!parsedResponse.bundles || !Array.isArray(parsedResponse.bundles)) {
      throw new Error('Invalid response structure: missing or invalid bundles array');
    }
    
    console.log(`✅ [AI_PARSER] Successfully parsed ${parsedResponse.bundles.length} bundles from JSON`);
    
    // Log bundle titles for debugging
    parsedResponse.bundles.forEach((bundle, index) => {
      console.log(`📦 [AI_PARSER] Bundle ${index + 1}: ${bundle.title} (${bundle.city})`);
    });
    
    return parsedResponse;
    
  } catch (error) {
    console.error('❌ [AI_PARSER] Failed to parse JSON response:', error);
    console.error('📝 [AI_PARSER] Raw response that failed:', responseText.substring(0, 500) + '...');
    
    // If JSON parsing fails, throw a descriptive error
    throw new Error(`Failed to parse AI response as JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Gets trip bundles from AI (real implementation)
 */
export const getBundlesFromAi = async (
  userPrompt: string
): Promise<GPTResponse> => {
  console.log('🚀 [REAL_AI] Calling OpenAI GPT-4o-mini...');
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set. Please set your OpenAI API key.');
  }
  
  try {
    const systemPrompt = createSystemPrompt();
    
    console.log('📤 [REAL_AI] Sending request to OpenAI...');
    console.log('🎯 [REAL_AI] Model: gpt-4o-mini');
    console.log('📝 [REAL_AI] System prompt length:', systemPrompt.length);
    console.log('👤 [REAL_AI] User prompt length:', userPrompt.length);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user", 
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }, // Force JSON response
    });
    
    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response content from OpenAI');
    }
    
    console.log('📥 [REAL_AI] Received response from OpenAI');
    console.log('📊 [REAL_AI] Response length:', responseText.length);
    console.log('💰 [REAL_AI] Tokens used:', completion.usage?.total_tokens || 'unknown');
    
    // Parse the AI response as JSON directly into GPTResponse
    const gptResponse = parseAiResponse(responseText);
    
    if (gptResponse.bundles.length === 0) {
      console.warn('⚠️ [REAL_AI] No bundles were returned from AI response');
      throw new Error('AI returned empty bundles array');
    }
    
    console.log(`✅ [REAL_AI] Successfully generated ${gptResponse.bundles.length} trip bundles`);
    
    return gptResponse;
    
  } catch (error) {
    console.error('❌ [REAL_AI] Error calling OpenAI:', error);
    throw error;
  }
};
