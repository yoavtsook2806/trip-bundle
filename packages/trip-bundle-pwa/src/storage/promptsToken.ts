import { PromptsUsage } from '../types';

const STORAGE_KEY = 'trip-bundle-prompts-usage';
const MAX_DAILY_CALLS = 10;

/**
 * Get today's date in YYYY-MM-DD format
 */
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get current prompts usage for today
 */
export const getPromptsUsage = (): PromptsUsage => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const today = getTodayString();
  
  if (!stored) {
    return {
      count: 0,
      date: today,
      maxDaily: MAX_DAILY_CALLS
    };
  }
  
  try {
    const usage: PromptsUsage = JSON.parse(stored);
    
    // Reset count if it's a new day
    if (usage.date !== today) {
      return {
        count: 0,
        date: today,
        maxDaily: MAX_DAILY_CALLS
      };
    }
    
    return {
      ...usage,
      maxDaily: MAX_DAILY_CALLS // Ensure max is always current
    };
  } catch {
    // If parsing fails, reset
    return {
      count: 0,
      date: today,
      maxDaily: MAX_DAILY_CALLS
    };
  }
};

/**
 * Increment prompts usage count
 */
export const incrementPromptsUsage = (): PromptsUsage => {
  const currentUsage = getPromptsUsage();
  const newUsage: PromptsUsage = {
    ...currentUsage,
    count: currentUsage.count + 1
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUsage));
  return newUsage;
};

/**
 * Check if user can make another prompt call
 */
export const canMakePromptCall = (): boolean => {
  const usage = getPromptsUsage();
  return usage.count < usage.maxDaily;
};

/**
 * Reset prompts usage (for testing/admin purposes)
 */
export const resetPromptsUsage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
